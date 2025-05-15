document.addEventListener('DOMContentLoaded', () => {
    const userMenuDropdown = document.querySelector('.user-menu .dropdown-content');
    // Simulate logged-in state
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Simulate user data and repair jobs (in a real app, fetch this)
    const simulatedUser = {
        username: 'RepairPro',
        avatar_url: 'https://images.websim.com/avatar/RepairPro' // Using guidance for avatar URLs
    };

    const simulatedRepairJobs = [
        { id: 'JOB_ABC123', item: 'Laptop (Serial #ABC123)', status: 'Diagnosing issue', estimated: '2-3 business days' },
        { id: 'JOB_XYZ', item: 'Microwave Oven (Model XYZ)', status: 'Waiting for replacement part', estimated: 'Approx. 1 week' },
        { id: 'JOB_SCREEN', item: 'Smartphone Screen Repair', status: 'Repair in progress', estimated: 'Completed by end of day' },
        { id: 'JOB_BATTERY', item: 'Tablet Battery', status: 'Completed', estimated: 'Ready for pickup at Brea Mall' } // Added completed job
    ];

    // Add conversation history for the chatbot
    // Initial message is now in HTML, so we don't need it in JS history start
    let conversationHistory = [];

    function updateMenu() {
        userMenuDropdown.innerHTML = ''; // Clear current content
        if (isLoggedIn) {
            userMenuDropdown.innerHTML = `
                <a href="/FiXerUppers/profile.html">Profile</a>
                <a href="/FiXerUppers/current-repair-jobs.html">Current Repair Jobs</a>
                <a href="/FiXerUppers/appointment.html">Make an Appointment</a>
                <a href="#" id="logout-link">Logout</a>
            `;
            document.getElementById('logout-link').addEventListener('click', handleLogout);
        } else {
            userMenuDropdown.innerHTML = `
                <a href="/FiXerUppers/login.html">Login</a>
                <a href="#" class="disabled-link">Profile</a>
                <a href="#" class="disabled-link">Current Repair Jobs</a>
                <a href="/FiXerUppers/appointment.html">Make an Appointment</a>
            `;
            userMenuDropdown.querySelectorAll('.disabled-link').forEach(link => {
                 link.style.opacity = '0.5';
                 link.style.pointerEvents = 'none';
            });
        }
    }

    function handleLogout(event) {
        event.preventDefault();
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/';
    }

    // Function to render profile content
    function renderProfile() {
        const usernameElement = document.getElementById('profile-username');
        const avatarElement = document.getElementById('profile-avatar');
        const jobsHeadingElement = document.getElementById('repair-jobs-heading');
        const jobsListElement = document.getElementById('pending-repair-jobs');

        if (!usernameElement || !avatarElement || !jobsListElement || !jobsHeadingElement) {
            // console.error("Profile elements not found. Not on profile page.");
            return; // Exit if elements don't exist (e.g., not on profile page)
        }

        if (isLoggedIn) {
            // Display user info
            usernameElement.textContent = `@${simulatedUser.username}`;
            avatarElement.src = `https://images.websim.com/avatar/${simulatedUser.username}`;
            avatarElement.alt = `${simulatedUser.username}'s Avatar`;

            // Display repair jobs (on profile page, maybe only show pending or a summary)
             const pendingJobs = simulatedRepairJobs.filter(job => job.status !== 'Completed');
             jobsHeadingElement.textContent = 'Your Repair Jobs (Pending):'; // Changed heading slightly

            if (pendingJobs.length > 0) {
                jobsListElement.innerHTML = pendingJobs.map(job => `
                    <div class="repair-job-item">
                        <p>Item: <strong>${job.item}</strong></p>
                        <p>Status: ${job.status}</p>
                        <p>Estimated Completion/Pickup: ${job.estimated}</p>
                    </div>
                `).join('');
            } else {
                jobsListElement.innerHTML = '<p>You have no pending repair jobs at this time.</p>';
            }

        } else {
            // If somehow on profile page but not logged in, redirect or show message
             window.location.href = '/login.html';
        }
    }

     // Function to render all repair jobs on the dedicated page
    function renderRepairJobsPage() {
        const jobsListElement = document.getElementById('repair-jobs-list');
         if (!jobsListElement) {
            // console.error("Repair jobs list element not found.");
            return; // Exit if elements don't exist
        }

        if (isLoggedIn) {
             jobsListElement.innerHTML = `<h3>All Your Repair Jobs:</h3>`;
             if (simulatedRepairJobs.length > 0) {
                jobsListElement.innerHTML += simulatedRepairJobs.map(job => `
                    <div class="repair-job-item">
                        <p>Item: <strong>${job.item}</strong></p>
                        <p>Status: ${job.status}</p>
                        <p>Estimated Completion/Pickup: ${job.estimated}</p>
                    </div>
                `).join('');
            } else {
                jobsListElement.innerHTML += '<p>You have no pending or completed repair jobs at this time.</p>';
            }
        } else {
             // If not logged in, redirect or show message
             window.location.href = '/login.html';
        }
    }


    // Function to handle appointment form submission
    function handleAppointmentSubmit(event) {
        event.preventDefault();

        const storeLocation = document.getElementById('store-location').value;
        const deviceType = document.getElementById('device-type').value;
        const repairType = document.getElementById('repair-type').value;
        const details = document.getElementById('details').value;

        if (!storeLocation || !deviceType || !repairType) {
            alert("Please fill out all required fields.");
            return;
        }

        console.log("Appointment Requested:");
        console.log(`Store: ${storeLocation}`);
        console.log(`Device Type: ${deviceType}`);
        console.log(`Repair Type: ${repairType}`);
        console.log(`Details: ${details}`);

        alert("Appointment request submitted successfully! We will contact you shortly to confirm.");

        document.getElementById('appointment-form').reset();
    }

    // Chatbot functions
    async function sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const chatWindow = document.getElementById('chat-window');
        const userMessageText = chatInput.value.trim();
        const userIconUrl = isLoggedIn ? `https://images.websim.com/avatar/${simulatedUser.username}` : '/favicon.png'; // Use user avatar if logged in, else default icon

        if (userMessageText === '') {
            return; // Don't send empty messages
        }

        // Add user message to UI
        const userMessageElement = document.createElement('div');
        userMessageElement.classList.add('chat-message', 'user-message');
        // Use the userIconUrl for the user's message icon
        userMessageElement.innerHTML = `<div class="message-content"><p>${userMessageText}</p></div><img src="${userIconUrl}" alt="User Icon" class="chat-message-icon">`;
        chatWindow.appendChild(userMessageElement);

        // Add user message to history
        conversationHistory.push({ role: "user", content: userMessageText });
        // Keep history limited (e.g., last 10 messages)
        conversationHistory = conversationHistory.slice(-10);


        chatInput.value = ''; // Clear input
        chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to bottom

         // Add a typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('chat-message', 'ai-message', 'typing-indicator');
        // Use tinyLogo.png for the AI icon
        typingIndicator.innerHTML = `<img src="/FiXerUppers/tinyLogo.png" alt="/FiXer Icon" class="chat-message-icon"><div class="message-content"><p>...</p></div>`;
        chatWindow.appendChild(typingIndicator);
        chatWindow.scrollTop = chatWindow.scrollHeight;


        try {
            // Prepare job data for the AI prompt
            const jobDataForAI = simulatedRepairJobs.map(job =>
                `Item: ${job.item}, Status: ${job.status}, Estimated: ${job.estimated}`
            ).join('; ');


            // Send message to LLM
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are FiXer, a friendly and helpful chatbot technician for FiXerUppers.
Your primary purpose is to assist users with questions about their specific repair jobs.
You can also provide general information about FiXerUppers services and products.
FiXerUppers specializes in repairs for electronics like phones, laptops, and desktops, and also sells DIY repair kits for these devices.
FiXerUppers is a verified Apple Service Provider. You should mention this when relevant, especially if the user asks about Apple device repairs or service quality for Apple products.
Here is a list of the current repair jobs for this specific user that you have access to: ${jobDataForAI}.
When answering about a user's repair job, refer to the information provided in this list.
Keep your responses concise and easy to understand.
If the user asks about a job or information that is NOT in the provided list, or is outside of general FiXerUppers services (repairs/kits for phones, laptops, desktops), politely state that you can only access information about the jobs listed and provide general info about FiXerUppers services, and suggest contacting customer service for more detailed or different inquiries.
Do not make up information about specific repairs not listed here or services/products beyond general electronics repair and DIY kits. Stick to the provided job information and general facts about FiXerUppers' core services.`,
                    },
                    ...conversationHistory, // Include the recent history
                ],
            });

             // Remove typing indicator
            chatWindow.removeChild(typingIndicator);


            // Check if completion and content exist before using it
            const aiMessageText = completion && completion.content ? completion.content : "Sorry, I couldn't generate a response.";

            if (aiMessageText === "Sorry, I couldn't generate a response.") {
                console.warn("AI completion successful but returned no content.");
                 // Keep the typing indicator removal and error message logic below as well for robustness
                  const errorMessageElement = document.createElement('div');
                  errorMessageElement.classList.add('chat-message', 'ai-message', 'error-message');
                  errorMessageElement.innerHTML = `<img src="/FiXerUppers/tinyLogo.png" alt="/FiXer Icon" class="chat-message-icon"><div class="message-content"><p>${aiMessageText}</p></div>`;
                  chatWindow.appendChild(errorMessageElement);
                  chatWindow.scrollTop = chatWindow.scrollHeight;
                   // Add error to history to prevent repeated attempts with the same error
                  conversationHistory.push({ role: "assistant", content: aiMessageText });

            } else {
                // Add AI message to UI
                const aiMessageElement = document.createElement('div');
                aiMessageElement.classList.add('chat-message', 'ai-message');
                // Use tinyLogo.png for the AI icon
                aiMessageElement.innerHTML = `<img src="/FiXerUppers/tinyLogo.png" alt="/FiXer Icon" class="chat-message-icon"><div class="message-content"><p>${aiMessageText}</p></div>`;
                chatWindow.appendChild(aiMessageElement);

                // Add AI message to history
                conversationHistory.push({ role: "assistant", content: aiMessageText });
                chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to bottom
            }


        } catch (error) {
            console.error("Error sending message to AI:", error);
             // Remove typing indicator if still present
             const currentTypingIndicator = chatWindow.querySelector('.typing-indicator');
             if (currentTypingIndicator) {
                chatWindow.removeChild(currentTypingIndicator);
             }


            // Display an error message in the chat
            const errorMessageElement = document.createElement('div');
            errorMessageElement.classList.add('chat-message', 'ai-message', 'error-message');
             errorMessageElement.innerHTML = `<img src="/FiXerUppers/tinyLogo.png" alt="/FiXer Icon" class="chat-message-icon"><div class="message-content"><p>Sorry, I'm having trouble connecting right now. Please try again later.</p></div>`; // Added icon and wrapped text
            chatWindow.appendChild(errorMessageElement);
            chatWindow.scrollTop = chatWindow.scrollHeight;
             // Add error to history to prevent repeated attempts with the same error
            conversationHistory.push({ role: "assistant", content: "Error: Could not connect to chat service." });
        }
    }

    // Check the current page path
    const currentPath = window.location.pathname;

    if (currentPath === '/login.html') {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (event) => {
                event.preventDefault();

                console.log('Simulating login...');
                localStorage.setItem('isLoggedIn', 'true');

                window.location.href = '/';
            });
        }
        updateMenu();

    } else if (currentPath === '/profile.html') {
        updateMenu();
        renderProfile();
    } else if (currentPath === '/appointment.html') {
        updateMenu();
        const appointmentForm = document.getElementById('appointment-form');
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', handleAppointmentSubmit);
        }
    } else if (currentPath === '/current-repair-jobs.html') {
         updateMenu(); // Update navbar
         renderRepairJobsPage(); // Render the job list on this page

         // Setup chatbot event listeners
         const sendButton = document.getElementById('send-button');
         const chatInput = document.getElementById('chat-input');

         if (sendButton && chatInput) {
             sendButton.addEventListener('click', sendMessage);
             chatInput.addEventListener('keypress', (event) => {
                 if (event.key === 'Enter') {
                     event.preventDefault(); // Prevent newline
                     sendMessage();
                 }
             });
         }

    }
     else {
        // This is the index page or other pages (including the new product pages)
        updateMenu();

        if (currentPath === '/' || currentPath === '/index.html') {
            const heroSpacer = document.querySelector('.hero-spacer');
            const backgroundOverlay = document.querySelector('.background-overlay');

            if (heroSpacer && backgroundOverlay) {
                const spacerHeight = heroSpacer.offsetHeight;

                window.addEventListener('scroll', () => {
                    const alpha = Math.min(window.scrollY / spacerHeight, 1);
                    backgroundOverlay.style.backgroundColor = `rgba(255, 255, 255, ${alpha})`;
                });
            }
        }
    }
});