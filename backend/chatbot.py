from flask import Flask, request, jsonify
import openai
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
app.secret_key = 'supersecretkey'
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("OpenAI API key not found. Please check your .env file.")

client = openai.OpenAI(api_key=api_key)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message')
        message_history = data.get('messages', [])

        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        # Append the new user message to the conversation history
        message_history.append({"role": "user", "content": user_message})

        # Call OpenAI API with the full message history
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=message_history
        )

        bot_message = response.choices[0].message.content
        message_history.append({"role": "assistant", "content": bot_message})

        return jsonify({'reply': bot_message, 'messages': message_history})

    except openai.error.OpenAIError as e:
        print(f"OpenAI API error: {e}")
        return jsonify({'error': 'OpenAI API error'}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/new-session', methods=['POST'])
def new_session():
    # This endpoint can remain as a placeholder to clear any backend session data if needed
    print("New session started.")
    return jsonify({'message': 'New session started'}), 200

if __name__ == '__main__':
    app.run(port=5001)
