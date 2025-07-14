REAL-TIME COLLABORATION TOOL

*COMPANY* : CODTECH IT SOLUTIONS

*NAME* : KIRAN SEKAR C

*INTERN ID* : CT04DF2036

*DOMAIN* : MERN STACK

*DURATION* : 4 WEEKS

*MENTOR* : NEELA SANTHOSH

CodTech Internship – Task 3: Real-Time Collaboration Tool
As part of Task 3 for the CodTech Internship, I was assigned to build a real-time collaboration tool such as a shared document editor or whiteboard, using WebSockets to enable live, synchronized interaction between multiple users. The main objective of this task was to develop a multi-user environment where all connected clients can collaborate in real time — changes made by one user should instantly reflect on the other users’ screens without needing to reload or refresh.

Objective of the Project
The goal was to simulate a real-time collaboration environment — similar to tools like Google Docs, Miro, or Microsoft Whiteboard — using minimal tech stack but with core functionality achieved through WebSocket communication. This project allowed me to explore real-time communication, server-client architecture, and multi-user handling, which are vital concepts in modern full-stack development.

Tools and Technologies Used
HTML5: Used for creating the structure of the user interface — the shared editor or whiteboard interface.

CSS3: Used for styling the application interface. CSS made the editor visually responsive, clean, and easy to interact with on different devices.

JavaScript (Vanilla JS): Handled client-side interactivity and WebSocket connection logic. All real-time updates and user events were written in JavaScript.

Node.js: Served as the backend platform to create the server that listens for incoming WebSocket connections from multiple clients.

Express.js: Used to set up a lightweight HTTP server to serve static files and manage WebSocket routes.

Socket.io: The key component used to establish WebSocket-based communication between clients and the server. It allows for broadcasting messages and synchronizing data between all connected users.

VS Code: Visual Studio Code was the main development environment used to write, debug, and run both client-side and server-side code. Extensions like Prettier, Live Server, and GitHub Copilot were used to boost productivity.

Git & GitHub: Version control was maintained using Git, and the entire project was uploaded to a public GitHub repository for transparency and collaboration. GitHub allowed me to track changes, commits, and organize the development process cleanly.

How It Works
When a user opens the tool, a WebSocket connection is established with the server using Socket.io.

Every time a user types text (in case of a text editor) or draws (in case of a whiteboard), the event is emitted to the server.

The server broadcasts this event to all other connected users using Socket.io.

All clients update their UI instantly without needing a page reload, thereby ensuring real-time sync.

For text editors, this involved syncing cursor positions, typed characters, and deletions.

For whiteboards, this involved syncing mouse positions, lines drawn, strokes, and colors used.

Applications and Use Cases
This type of tool has widespread practical applications:

Remote Team Collaboration: Teams working remotely can use this tool to co-edit documents or brainstorm on whiteboards in real-time.

Online Education Platforms: Teachers and students can interact live using this tool for lectures, tutorials, and explanations.

Live Coding Interviews: Real-time code editors can be used for conducting technical interviews.

Design and UI Collaboration: UX teams can use collaborative whiteboards to map out wireframes and workflows together.

Key Features Implemented
Multi-user support (all users stay connected to one server)

Real-time data sync (text or drawings update instantly)

Easy-to-use interface

Cross-browser compatibility

Responsive design for desktop and tablets

Conclusion
This project provided hands-on experience with real-time networking, event-driven programming, and client-server architecture, all of which are fundamental to modern web applications. It also helped enhance my understanding of working with WebSocket protocols, managing concurrent users, and developing scalable and responsive applications.

Successfully completing this task has prepared me for more advanced collaborative systems and gave me a strong grasp of real-time technologies, which are essential in today's tech-driven industries.

OUTPUT:-

https://github.com/Kiransekarc/REAL-TIME-COLLABORATION-TOOL/blob/6469579e3560d0d5e1412c9776be1de434dd04c8/REAL%20TIME%20COLLAB%20OUTPUT%201.png

https://github.com/Kiransekarc/REAL-TIME-COLLABORATION-TOOL/blob/f0a569a56cfeff4070e4f0f006252dbf7ceb6c04/REAL%20TIME%20COLLAB%20OUTPUT%202.png

