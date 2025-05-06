export const CodeSnippet = [
    {
        "language": "cURL",
        "code": [
            "curl --location",
            "--request POST 'http://whatsapp.sendersms.in/api/v1/whatsapp/otp?api_key=YOUR_API_KEY'",
            "--header 'Content-Type: application/json'",
            "--data-raw {",
            "sender: +919999999999",
            "to: +919998887776",
            "template_id: XXXXXXXXXXXX",
            "}"
        ]
    },
    {
        "language": "PHP",
        "code": [
            "<?php",
            "$curl = curl_init();",
            "curl_setopt_array($curl, array(",
            "  CURLOPT_URL => 'http://whatsapp.sendersms.in/api/v1/whatsapp/otp?api_key=YOUR_API_KEY',",
            "  CURLOPT_RETURNTRANSFER => true,",
            "  CURLOPT_CUSTOMREQUEST => 'POST',",
            "  CURLOPT_HTTPHEADER => array(",
            "    'Content-Type: application/json'",
            "  ),",
            "  CURLOPT_POSTFIELDS => json_encode(array(",
            "sender => +919999999999",
            "to => +919998887776",
            "template_id => XXXXXXXXXXXX",
            "  ))",
            "));",
            "$response = curl_exec($curl);",
            "curl_close($curl);",
            "echo $response;"
        ]
    },
    {
        "language": "NodeJS",
        "code": [
            "const axios = require('axios');",
            "",
            "axios.post('http://whatsapp.sendersms.in/api/v1/whatsapp/otp?api_key=YOUR_API_KEY', {",
            "sender: +919999999999",
            "to: +919998887776",
            "template_id: XXXXXXXXXXXX",
            "}, {",
            "  headers: {",
            "    'Content-Type': 'application/json'",
            "  }",
            "})",
            ".then(response => console.log(response.data))",
            ".catch(error => console.error(error));"
        ]
    },
    {
        "language": "JSON",
        "code": [
            "{",
            "sender: +919999999999",
            "to: +919998887776",
            "template_id: XXXXXXXXXXX",
            "}"
        ]
    }
]