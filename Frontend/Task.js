// Establish WebSocket connection
const ws = new WebSocket('ws://localhost:3000');

// Register the user (You can dynamically generate userId, for now using a fixed one)
const userId = "1";  // You can dynamically generate this based on user
const role = "Admin"; // Set default role, this will be updated when a role is selected

// When the WebSocket connection is open, send registration message
ws.onopen = () => {
  console.log('Connected to WebSocket server');
  registerUser(userId, role);
};

function getData() {
    const res = fetch("http://localhost:3000/api/myData", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${authToken}`, // Include token in headers
        },
    });

    if (res.ok) {
        const data = res.json();
        userId = data.userId;
        role = data.role;
    }

}

// Register user with their userId and role
function registerUser(userId, role) {
  const registerMessage = {
    type: 'register',
    userId: userId,
    role: role,
  };
  
  ws.send(JSON.stringify(registerMessage));
}

// Listen for incoming messages (in case you want to handle them later)
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === 'message') {
    console.log(`Message from ${message.senderId}: ${message.content}`);
  }
};

// Get the dropdown and textarea elements
const roleDropdown = document.querySelector('.dropdown-content');
const taskArea = document.querySelector('#taskArea');
const assignButton = document.querySelector('button');

// Handle role selection
let selectedRole = '';  // Store selected role

roleDropdown.addEventListener('click', (e) => {
  const selectedItem = e.target;
  if (selectedItem.tagName === 'A') {
    selectedRole = selectedItem.innerText;  // Update selected role
    document.querySelector('.btn span').textContent = selectedRole;
    console.log(`Role selected: ${selectedRole}`);
  }
});

// Handle the 'Assign Task' button click
assignButton.addEventListener('click', () => {
  const taskDescription = taskArea.value.trim();

  if (selectedRole && taskDescription) {
    const taskMessage = {
      type: 'message',
      senderId: userId,
      targetRole: selectedRole,
      content: taskDescription,
    };

    // Send the task message to all users with the selected role
    ws.send(JSON.stringify(taskMessage));
    console.log(`Task assigned to ${selectedRole}: ${taskDescription}`);

    // Clear the textarea
    taskArea.value = '';
  } else {
    alert('Please select a role and describe the task.');
  }
});
