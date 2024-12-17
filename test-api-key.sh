curl -X POST http://localhost:3000/api/chat/completions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENWEBUI_API_KEY" \
-d '{
  "model": "mistral:latest",
  "messages": [{"role": "user", "content": "Hello"}]
}'
