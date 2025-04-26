
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#addUserForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // ✅ Stops the page reload

    // your form handling code here...
  });
});

document.querySelector('#addUserForm').addEventListener('submit', async (event) => {
  event.preventDefault();
 
  // Collect form data
  const firstName = document.querySelector('#first_name').value.trim();
  const lastName = document.querySelector('#last_name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const address = document.querySelector('#address').value.trim();
  const gender = document.querySelector('#gender').value === "male" ? "M" : "F";
  const dob = document.querySelector('#dob').value;
  const telephone = document.querySelector('#telephone').value.trim();
  const age = parseInt(document.querySelector('#age').value, 10);
  const password = document.querySelector('#password').value.trim();
  const role = document.querySelector('#role').value.trim();

  // Validate inputs
  if (!firstName || !lastName || !address || !dob || !telephone || !age || !email|| !password ||!role ) {
      alert("Please fill in all required fields.");
      return;
  }

  if (age <= 0 ) {
      alert("Age  must be positive values.");
      return;
  }

  // Prepare the data object
  const jsonData = {
      first_name: firstName,
      last_name: lastName,
      email:email,
      address: address,
      gender: gender,
      dob: dob,
      telephone: telephone,
      age: age,
      password: password,
      role: role
  };

  
 
  try {
      const response = await fetch('http://localhost:3000/api/signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              
          },
          body: JSON.stringify(jsonData), // Send the JSON data
      });

      const result = await response.json();

      // Handle server response
      if (response.ok) {
          alert(`User added successfully!`);
          window.location.href = 'login.html'; // Redirect to employee list
      } else {
          alert(`Failed to add user: ${result.message}`);
      }
  } catch (error) {
      console.error('Error adding user:', error);
      alert('An error occurred. Please try again.');
  }
});