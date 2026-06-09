# ── AI Study Copilot — Dockerfile ─────────────────────────────────────────────
#
# MULTI-STAGE BUILD: We use two stages to keep the final image small.
# Stage 1 (builder): Install all dependencies (large, messy)
# Stage 2 (runtime): Copy only what's needed to run the app (lean)
#
# Without multi-stage builds, the image would include build tools,
# pip cache, and other bloat that isn't needed at runtime.

# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM python:3.11-slim as builder

WORKDIR /build

# Install system dependencies needed to BUILD Python packages
# (not needed at runtime, which is why they stay in the builder stage)
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first — Docker layer caching optimization.
# If requirements.txt doesn't change, this layer is cached.
# Only changes to requirements.txt trigger a re-install.
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt


# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM python:3.11-slim

# Create a non-root user — never run production services as root
# If the container is compromised, the attacker has limited permissions
RUN useradd --create-home --shell /bin/bash appuser

WORKDIR /app

# Copy installed packages from builder stage
COPY --from=builder /root/.local /home/appuser/.local

# Copy application code
COPY app/ ./app/

# Create required directories with proper ownership
RUN mkdir -p uploads vector_stores && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Make sure the installed packages are on PATH
ENV PATH=/home/appuser/.local/bin:$PATH
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1    

# Expose the port uvicorn will listen on
EXPOSE 8000

# Health check — Docker uses this to monitor container health
# If this fails 3 times in a row, Docker marks the container unhealthy
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

# Start command
# --host 0.0.0.0 makes it accessible from outside the container
# --workers 4    spawns 4 worker processes (tune based on CPU cores)
# For development: uvicorn app.main:app --reload
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
