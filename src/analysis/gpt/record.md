# result
{
  "feel": {
    "RED": ["당황하고", "짜증도 났"],
    "YELLOW": [],
    "BLUE": ["들떴는데"],
    "GREEN": ["안심이 되었다", "마음이 따뜻해졌다", "차분히"]
  },
  "ratio": {
    "RED": 0.20,
    "YELLOW": 0.00,
    "BLUE": 0.15,
    "GREEN": 0.65
  }
}
# response
{
    "id": "resp_6883c0d2744c819eacaa431edf89613c0e0f604822b16ba3",
    "object": "response",
    "created_at": 1753465042,
    "status": "completed",
    "background": false,
    "error": null,
    "incomplete_details": null,
    "instructions": null,
    "max_output_tokens": null,
    "max_tool_calls": null,
    "model": "gpt-4o-mini-2024-07-18",
    "output": [
        {
            "id": "msg_6883c0d3838c819ea31ac3b9b21e765e0e0f604822b16ba3",
            "type": "message",
            "status": "completed",
            "content": [
                {
                    "type": "output_text",
                    "annotations": [],
                    "logprobs": [],
                    "text": "{\n  \"feel\": {\n    \"RED\": [\"당황하고\", \"짜증도 났\"],\n    \"YELLOW\": [],\n    \"BLUE\": [\"들떴는데\"],\n    \"GREEN\": [\"안심이 되었다\", \"마음이 따뜻해졌다\", \"차분히\"]\n  },\n  \"ratio\": {\n    \"RED\": 0.20,\n    \"YELLOW\": 0.00,\n    \"BLUE\": 0.15,\n    \"GREEN\": 0.65\n  }\n}"
                }
            ],
            "role": "assistant"
        }
    ],
    "parallel_tool_calls": true,
    "previous_response_id": null,
    "prompt_cache_key": null,
    "reasoning": {
        "effort": null,
        "summary": null
    },
    "safety_identifier": null,
    "service_tier": "default",
    "store": true,
    "temperature": 1,
    "text": {
        "format": {
            "type": "text"
        }
    },
    "tool_choice": "auto",
    "tools": [],
    "top_logprobs": 0,
    "top_p": 1,
    "truncation": "disabled",
    "usage": {
        "input_tokens": 975,
        "input_tokens_details": {
            "cached_tokens": 0
        },
        "output_tokens": 111,
        "output_tokens_details": {
            "reasoning_tokens": 0
        },
        "total_tokens": 1086
    },
    "user": null,
    "metadata": {},
    "output_text": "{\n  \"feel\": {\n    \"RED\": [\"당황하고\", \"짜증도 났\"],\n    \"YELLOW\": [],\n    \"BLUE\": [\"들떴는데\"],\n    \"GREEN\": [\"안심이 되었다\", \"마음이 따뜻해졌다\", \"차분히\"]\n  },\n  \"ratio\": {\n    \"RED\": 0.20,\n    \"YELLOW\": 0.00,\n    \"BLUE\": 0.15,\n    \"GREEN\": 0.65\n  }\n}"
}