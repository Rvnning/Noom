const socket = io();

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const chat = document.getElementById("chat");

let roomName;

chat.hidden = true;
function showCountRoom(count) {
  const h3 = chat.querySelector("h3");
  h3.innerText = `Room: ${roomName} (${count})`;
}

function addMessage(message) {
  const ul = chat.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = chat.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function ShowRoom(newCount) {
  welcome.hidden = true;
  chat.hidden = false;
  showCountRoom(newCount);
  const msgForm = chat.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSumbmit(event) {
  event.preventDefault();
  const roomInput = room.querySelector("#name");
  const nicknameInput = room.querySelector("#nick");
  socket.emit("enter_room", roomInput.value, nicknameInput.value, ShowRoom);
  roomName = roomInput.value;
  roomInput.value = "";
}

room.addEventListener("submit", handleRoomSumbmit);

socket.on("welcome", (user, newCount) => {
  showCountRoom(newCount);
  addMessage(`${user} joined!`);
});

socket.on("bye", (left, newCount) => {
  showCountRoom(newCount);
  addMessage(`${left} left!`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
