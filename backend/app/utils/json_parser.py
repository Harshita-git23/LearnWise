import json
import re


def clean_json_response(
    response: str
):

    response = response.strip()

    response = re.sub(
        r"^```json",
        "",
        response,
        flags=re.IGNORECASE
    )

    response = re.sub(
        r"^```",
        "",
        response
    )

    response = re.sub(
        r"```$",
        "",
        response
    )

    return response.strip()


def parse_json_response(
    response: str
):

    cleaned = clean_json_response(
        response
    )

    return json.loads(
        cleaned
    )