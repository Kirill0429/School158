from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import json

app = FastAPI()

# Разрешаем CORS для всех источников (для тестирования)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение к базе данных
conn = sqlite3.connect("chat.db", check_same_thread=False)
cursor = conn.cursor()

# Создание таблицы, если её нет
cursor.execute("""
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT,
    message TEXT
)
""")
conn.commit()

# Храним WebSocket-подключения
active_connections = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)

    # Отправляем историю сообщений при подключении
    cursor.execute("SELECT user, message FROM messages")
    history = cursor.fetchall()
    await websocket.send_text(json.dumps(history))

    try:
        while True:
            data = await websocket.receive_text()
            user, message = json.loads(data)

            # Сохраняем сообщение в БД
            cursor.execute("INSERT INTO messages (user, message) VALUES (?, ?)", (user, message))
            conn.commit()

            # Отправляем сообщение всем клиентам
            for connection in active_connections:
                await connection.send_text(json.dumps([(user, message)]))

    except Exception as e:
        active_connections.remove(websocket)
