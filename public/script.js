const socket = io();
let username = "";
let isDarkMode = false;
let typingTimeout;

// DOM Elements
const loginContainer = document.getElementById('login-container');
const editorContainer = document.getElementById('editor-container');
const usernameInput = document.getElementById('username');
const editor = document.getElementById('editor');
const statusBar = document.getElementById('status-bar');
const userList = document.getElementById('user-list');
const titleInput = document.getElementById('doc-title');
const currentUserElement = document.getElementById('current-user');
const typingIndicator = document.getElementById('typing-indicator');
const userCount = document.getElementById('user-count');
const wordCountElement = document.getElementById('word-count');
const autoSaveIndicator = document.querySelector('.auto-save-indicator');
const notificationContainer = document.getElementById('notification-container');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Focus username input
  usernameInput.focus();
  
  // Handle Enter key in username input
  usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      join();
    }
  });
  
  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    toggleTheme();
  }
  
  // Load auto-saved content
  const autoSavedContent = localStorage.getItem('autoSaveDoc');
  if (autoSavedContent) {
    editor.value = autoSavedContent;
    updateWordCount();
  }
});

// Join function
function join() {
  username = usernameInput.value.trim();
  if (!username) {
    showNotification('Please enter your name', 'error');
    usernameInput.focus();
    return;
  }
  
  if (username.length > 20) {
    showNotification('Name must be 20 characters or less', 'error');
    return;
  }

  loginContainer.style.display = 'none';
  editorContainer.style.display = 'flex';
  currentUserElement.textContent = username;
  
  // Generate user avatar with first letter
  const userAvatar = document.querySelector('.user-avatar');
  userAvatar.textContent = username.charAt(0).toUpperCase();
  
  socket.emit('join', username);
  showNotification(`Welcome, ${username}!`, 'success');
  
  // Focus editor
  setTimeout(() => editor.focus(), 100);
}

// Editor event listeners
editor.addEventListener('input', debounce(() => {
  socket.emit('edit-document', {
    content: editor.value,
    username
  });
  
  // Auto-save to localStorage
  localStorage.setItem('autoSaveDoc', editor.value);
  showAutoSaveIndicator();
  
  // Update word count
  updateWordCount();
  
  // Show typing indicator
  clearTimeout(typingTimeout);
  socket.emit('typing', username);
  
  typingTimeout = setTimeout(() => {
    socket.emit('stop-typing', username);
  }, 1000);
}, 300));

// Title input event listener
titleInput.addEventListener('input', debounce(() => {
  socket.emit('edit-title', titleInput.value);
}, 500));

// Socket event handlers
socket.on('load', ({ content, title }) => {
  const autoSavedContent = localStorage.getItem('autoSaveDoc');
  editor.value = autoSavedContent || content;
  titleInput.value = title;
  updateWordCount();
});

socket.on('update-document', ({ content, username }) => {
  // Only update if it's not from the current user
  if (username !== window.username) {
    editor.value = content;
    localStorage.setItem('autoSaveDoc', content);
    updateWordCount();
  }
});

socket.on('update-title', (title) => {
  titleInput.value = title;
});

socket.on('active-users', (users) => {
  updateUserList(users);
  userCount.textContent = users.length;
});

socket.on('user-joined', (name) => {
  showNotification(`${name} joined the document`, 'info');
  addActivityItem(`${name} joined`, 'join');
});

socket.on('user-left', (name) => {
  showNotification(`${name} left the document`, 'info');
  addActivityItem(`${name} left`, 'leave');
});

socket.on('show-typing', (name) => {
  typingIndicator.textContent = `${name} is typing...`;
  typingIndicator.style.opacity = '1';
});

socket.on('stop-typing', () => {
  typingIndicator.style.opacity = '0';
  setTimeout(() => {
    typingIndicator.textContent = '';
  }, 300);
});

// Connection status
socket.on('connect', () => {
  updateConnectionStatus(true);
});

socket.on('disconnect', () => {
  updateConnectionStatus(false);
  showNotification('Connection lost. Reconnecting...', 'error');
});

socket.on('reconnect', () => {
  showNotification('Reconnected successfully!', 'success');
  updateConnectionStatus(true);
});

// Utility Functions
function updateUserList(users) {
  userList.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = user;
    if (user === username) {
      li.style.background = 'var(--primary-color)';
      li.style.color = 'white';
    }
    userList.appendChild(li);
  });
}

function updateWordCount() {
  const text = editor.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  const characters = editor.value.length;
  wordCountElement.textContent = `${words} words, ${characters} characters`;
}

function showAutoSaveIndicator() {
  autoSaveIndicator.classList.add('show');
  setTimeout(() => {
    autoSaveIndicator.classList.remove('show');
  }, 2000);
}

function updateConnectionStatus(isConnected) {
  const connectionStatus = document.querySelector('.connection-status');
  if (isConnected) {
    connectionStatus.classList.add('online');
    connectionStatus.classList.remove('offline');
    connectionStatus.innerHTML = '<i class="fas fa-circle"></i> Connected';
  } else {
    connectionStatus.classList.remove('online');
    connectionStatus.classList.add('offline');
    connectionStatus.innerHTML = '<i class="fas fa-circle"></i> Disconnected';
    connectionStatus.style.color = 'var(--error-color)';
  }
}

function addActivityItem(text, type) {
  const activityFeed = document.getElementById('activity-feed');
  const item = document.createElement('div');
  item.className = 'activity-item';
  
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  item.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span>${text}</span>
      <span style="font-size: 10px; color: var(--text-muted);">${time}</span>
    </div>
  `;
  
  activityFeed.insertBefore(item, activityFeed.firstChild);
  
  // Keep only last 10 activities
  while (activityFeed.children.length > 10) {
    activityFeed.removeChild(activityFeed.lastChild);
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icon = type === 'success' ? 'check-circle' : 
               type === 'error' ? 'exclamation-circle' : 'info-circle';
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <i class="fas fa-${icon}"></i>
      <span>${message}</span>
    </div>
  `;
  
  notificationContainer.appendChild(notification);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => {
        notificationContainer.removeChild(notification);
      }, 300);
    }
  }, 4000);
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle('dark');
  isDarkMode = !isDarkMode;
  
  const themeButton = document.querySelector('.theme-toggle i');
  themeButton.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
  
  // Save theme preference
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  
  showNotification(`Switched to ${isDarkMode ? 'dark' : 'light'} theme`, 'info');
}

// Download function
function download() {
  const content = editor.value;
  const title = titleInput.value || 'Untitled Document';
  
  if (!content.trim()) {
    showNotification('Document is empty', 'error');
    return;
  }
  
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${title}.txt`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('Document downloaded successfully', 'success');
}

// Toolbar functions
function formatText(command) {
  const button = event.target.closest('.toolbar-btn');
  
  // Toggle active state
  button.classList.toggle('active');
  
  // Get current selection
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selectedText = editor.value.substring(start, end);
  
  if (selectedText) {
    let formattedText = selectedText;
    
    switch (command) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
    }
    
    // Replace selected text
    editor.value = editor.value.substring(0, start) + formattedText + editor.value.substring(end);
    
    // Update cursor position
    editor.setSelectionRange(start, start + formattedText.length);
    editor.focus();
    
    // Trigger input event to sync with other users
    editor.dispatchEvent(new Event('input'));
  } else {
    showNotification('Please select text first', 'info');
  }
}

function insertList() {
  const cursorPos = editor.selectionStart;
  const textBefore = editor.value.substring(0, cursorPos);
  const textAfter = editor.value.substring(cursorPos);
  
  const listItem = '\n• ';
  editor.value = textBefore + listItem + textAfter;
  editor.setSelectionRange(cursorPos + listItem.length, cursorPos + listItem.length);
  editor.focus();
  
  // Trigger input event
  editor.dispatchEvent(new Event('input'));
}

function insertNumberedList() {
  const cursorPos = editor.selectionStart;
  const textBefore = editor.value.substring(0, cursorPos);
  const textAfter = editor.value.substring(cursorPos);
  
  const listItem = '\n1. ';
  editor.value = textBefore + listItem + textAfter;
  editor.setSelectionRange(cursorPos + listItem.length, cursorPos + listItem.length);
  editor.focus();
  
  // Trigger input event
  editor.dispatchEvent(new Event('input'));
}

// Debounce function to limit API calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + S to save
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    download();
  }
  
  // Ctrl/Cmd + D to toggle theme
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault();
    toggleTheme();
  }
  
  // Ctrl/Cmd + B for bold (when editor is focused)
  if ((e.ctrlKey || e.metaKey) && e.key === 'b' && document.activeElement === editor) {
    e.preventDefault();
    formatText('bold');
  }
  
  // Ctrl/Cmd + I for italic (when editor is focused)
  if ((e.ctrlKey || e.metaKey) && e.key === 'i' && document.activeElement === editor) {
    e.preventDefault();
    formatText('italic');
  }
  
  // Ctrl/Cmd + U for underline (when editor is focused)
  if ((e.ctrlKey || e.metaKey) && e.key === 'u' && document.activeElement === editor) {
    e.preventDefault();
    formatText('underline');
  }
});

// Add slide out animation to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .connection-status.offline {
    color: var(--error-color) !important;
  }
`;
document.head.appendChild(style);

// Auto-focus and enhance UX
window.addEventListener('load', () => {
  // Add loading state
  document.body.classList.remove('loading');
  
  // Smooth transitions
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// Handle visibility change (tab switching)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Save current state when tab becomes hidden
    if (editor.value) {
      localStorage.setItem('autoSaveDoc', editor.value);
    }
  }
});

// Prevent accidental page reload
window.addEventListener('beforeunload', (e) => {
  if (editor && editor.value.trim()) {
    e.preventDefault();
    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    return e.returnValue;
  }
});

// Global error handler
window.addEventListener('error', (e) => {
  console.error('Application error:', e.error);
  showNotification('An error occurred. Please refresh the page.', 'error');
});

// Initialize word count on load
setTimeout(updateWordCount, 100);