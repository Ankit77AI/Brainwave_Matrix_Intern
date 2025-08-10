// Day Planner Application
class DayPlanner {
    constructor() {
        this.currentDate = new Date();
        this.tasks = new Map();
        this.editingTaskId = null;
        this.showCompleted = false;
        this.searchQuery = '';
        this.priorityFilter = 'all';
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        this.initializeApp();
        this.bindEvents();
        this.loadTasks();
        this.renderSchedule();
        this.updateCurrentTimeIndicator();
        this.updateDailyQuote();
        
        // Update current time indicator every minute
        setInterval(() => this.updateCurrentTimeIndicator(), 60000);
    }

    initializeApp() {
        // Set initial theme
        this.setTheme(this.isDarkMode);
        
        // Set current date
        this.updateDateDisplay();
        document.getElementById('dateInput').value = this.formatDateForInput(this.currentDate);
        
        // Generate time slots
        this.generateTimeSlots();
    }

    bindEvents() {
        // Header controls
        document.getElementById('darkModeToggle').addEventListener('click', () => this.toggleDarkMode());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportTasks());
        document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
        document.getElementById('importFile').addEventListener('change', (e) => this.importTasks(e));

        // Date navigation
        document.getElementById('prevDay').addEventListener('click', () => this.navigateDate(-1));
        document.getElementById('nextDay').addEventListener('click', () => this.navigateDate(1));
        document.getElementById('dateInput').addEventListener('change', (e) => this.onDateChange(e));

        // Search and filter
        document.getElementById('searchInput').addEventListener('input', (e) => this.onSearchInput(e));
        document.getElementById('searchBtn').addEventListener('click', () => this.performSearch());
        document.getElementById('priorityFilter').addEventListener('change', (e) => this.onPriorityFilterChange(e));
        document.getElementById('completedToggle').addEventListener('click', () => this.toggleCompletedView());

        // Task management
        document.getElementById('addTaskBtn').addEventListener('click', () => this.showAddTaskModal());
        document.getElementById('closeModal').addEventListener('click', () => this.hideModal());
        document.getElementById('cancelTask').addEventListener('click', () => this.hideModal());
        document.getElementById('taskForm').addEventListener('submit', (e) => this.handleTaskSubmit(e));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    // Theme Management
    setTheme(isDark) {
        this.isDarkMode = isDark;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('darkMode', isDark);
        
        const toggleBtn = document.getElementById('darkModeToggle');
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
        toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    toggleDarkMode() {
        this.setTheme(!this.isDarkMode);
    }

    // Date Management
    navigateDate(direction) {
        this.currentDate.setDate(this.currentDate.getDate() + direction);
        this.updateDateDisplay();
        document.getElementById('dateInput').value = this.formatDateForInput(this.currentDate);
        this.renderSchedule();
    }

    onDateChange(event) {
        const newDate = new Date(event.target.value);
        this.currentDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
        this.updateDateDisplay();
        this.renderSchedule();
    }

    updateDateDisplay() {
        const today = new Date();
        const isToday = this.currentDate.toDateString() === today.toDateString();
        
        const dateElement = document.getElementById('currentDate');
        const dayElement = document.getElementById('currentDay');
        
        if (isToday) {
            dateElement.textContent = 'Today';
        } else {
            dateElement.textContent = this.currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric' 
            });
        }
        
        dayElement.textContent = this.currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }

    // Time Slots Generation
    generateTimeSlots() {
        const timeSlotsContainer = document.getElementById('timeSlots');
        timeSlotsContainer.innerHTML = '';
        
        for (let hour = 0; hour <= 23; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = this.formatTime(hour);
            timeSlotsContainer.appendChild(timeSlot);
        }
    }

    formatTime(hour) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour} ${period}`;
    }

    // Current Time Indicator
    updateCurrentTimeIndicator() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Only show indicator for current day and within schedule hours
        if (this.currentDate.toDateString() === now.toDateString() && 
            currentHour >= 0 && currentHour <= 23) {
            
            const indicator = document.getElementById('currentTimeIndicator');
            const timeSlotHeight = 60; // Height of each time slot in pixels
            const startHour = 0;
            
            const position = ((currentHour - startHour) * 60 + currentMinute) * (timeSlotHeight / 60);
            indicator.style.top = `${position}px`;
            indicator.style.display = 'block';
        } else {
            document.getElementById('currentTimeIndicator').style.display = 'none';
        }
    }

    // Daily Quote
    updateDailyQuote() {
        const quotes = [
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
            "The future depends on what you do today. - Mahatma Gandhi",
            "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
            "The secret of getting ahead is getting started. - Mark Twain",
            "Time is what we want most, but what we use worst. - William Penn",
            "Plan your work and work your plan. - Napoleon Hill",
            "Every minute spent planning saves five in execution. - Brian Tracy"
        ];
        
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        document.getElementById('dailyQuote').querySelector('p').textContent = randomQuote;
    }

    // Task Management
    showAddTaskModal() {
        this.editingTaskId = null;
        document.getElementById('modalTitle').textContent = 'Add New Task';
        document.getElementById('taskForm').reset();
        
        // Set default times
        const now = new Date();
        const startTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
        const endTime = new Date(startTime.getTime() + 60 * 60000); // 1 hour duration
        
        document.getElementById('startTime').value = this.formatTimeForInput(startTime);
        document.getElementById('endTime').value = this.formatTimeForInput(endTime);
        
        document.getElementById('taskModal').classList.add('show');
        document.getElementById('taskTitle').focus();
    }

    showEditTaskModal(taskId) {
        const task = this.tasks.get(taskId);
        if (!task) return;
        
        this.editingTaskId = taskId;
        document.getElementById('modalTitle').textContent = 'Edit Task';
        
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('startTime').value = task.startTime;
        document.getElementById('endTime').value = task.endTime;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskPriority').value = task.priority;
        
        document.getElementById('taskModal').classList.add('show');
        document.getElementById('taskTitle').focus();
    }

    hideModal() {
        document.getElementById('taskModal').classList.remove('show');
        this.editingTaskId = null;
    }

    handleTaskSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const taskData = {
            title: formData.get('taskTitle') || document.getElementById('taskTitle').value,
            startTime: formData.get('startTime') || document.getElementById('startTime').value,
            endTime: formData.get('endTime') || document.getElementById('endTime').value,
            description: formData.get('taskDescription') || document.getElementById('taskDescription').value,
            priority: formData.get('taskPriority') || document.getElementById('taskPriority').value
        };
        
        // Validate time
        if (taskData.startTime >= taskData.endTime) {
            this.showNotification('End time must be after start time', 'error');
            return;
        }
        
        // Check for time conflicts
        if (this.hasTimeConflict(taskData.startTime, taskData.endTime, this.editingTaskId)) {
            this.showNotification('This time slot conflicts with an existing task', 'warning');
            return;
        }
        
        if (this.editingTaskId) {
            this.updateTask(this.editingTaskId, taskData);
        } else {
            this.addTask(taskData);
        }
        
        this.hideModal();
        this.renderSchedule();
        this.saveTasks();
    }

    addTask(taskData) {
        const taskId = Date.now().toString();
        const task = {
            id: taskId,
            ...taskData,
            completed: false,
            createdAt: new Date().toISOString(),
            date: this.currentDate.toISOString() // Store the date this task was created for
        };
        
        console.log('Adding task:', task);
        this.tasks.set(taskId, task);
        this.showNotification('Task added successfully', 'success');
    }

    updateTask(taskId, taskData) {
        const existingTask = this.tasks.get(taskId);
        if (!existingTask) return;
        
        const updatedTask = {
            ...existingTask,
            ...taskData,
            updatedAt: new Date().toISOString()
        };
        
        this.tasks.set(taskId, updatedTask);
        this.showNotification('Task updated successfully', 'success');
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks.delete(taskId);
            this.renderSchedule();
            this.saveTasks();
            this.showNotification('Task deleted successfully', 'success');
        }
    }

    toggleTaskComplete(taskId) {
        const task = this.tasks.get(taskId);
        if (!task) return;
        
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        
        this.renderSchedule();
        this.saveTasks();
        
        const message = task.completed ? 'Task marked as completed' : 'Task marked as incomplete';
        this.showNotification(message, 'success');
    }

    hasTimeConflict(startTime, endTime, excludeTaskId = null) {
        const start = this.timeToMinutes(startTime);
        const end = this.timeToMinutes(endTime);
        
        for (const [taskId, task] of this.tasks) {
            if (excludeTaskId === taskId) continue;
            if (task.completed) continue;
            
            const taskStart = this.timeToMinutes(task.startTime);
            const taskEnd = this.timeToMinutes(task.endTime);
            
            if ((start < taskEnd && end > taskStart)) {
                return true;
            }
        }
        return false;
    }

    timeToMinutes(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Task Rendering
    renderSchedule() {
        const tasksContainer = document.getElementById('tasksContainer');
        tasksContainer.innerHTML = '';
        
        const currentDateKey = this.currentDate.toDateString();
        console.log('Current date:', currentDateKey);
        console.log('All tasks:', Array.from(this.tasks.values()));
        
        const dayTasks = Array.from(this.tasks.values())
            .filter(task => {
                // Check if task was created for the current date OR if it's a recurring task
                const taskDate = task.date || task.createdAt;
                const taskDateString = new Date(taskDate).toDateString();
                console.log('Task:', task.title, 'Date:', taskDateString, 'Matches:', taskDateString === currentDateKey);
                return taskDateString === currentDateKey;
            })
            .filter(task => this.filterTask(task));
        
        console.log('Filtered tasks for current date:', dayTasks);
        
        dayTasks.forEach(task => {
            if (!task.completed || this.showCompleted) {
                this.renderTask(task);
            }
        });
        
        this.renderCompletedTasks();
    }

    renderTask(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `task ${task.priority}-priority ${task.completed ? 'completed' : ''}`;
        taskElement.setAttribute('data-task-id', task.id);
        taskElement.draggable = true;
        
        const startMinutes = this.timeToMinutes(task.startTime);
        const endMinutes = this.timeToMinutes(task.endTime);
        const duration = endMinutes - startMinutes;
        
        const top = (startMinutes - 0 * 60) * (60 / 60); // 12 AM start, 60px per hour
        const height = duration * (60 / 60);
        
        taskElement.style.top = `${top}px`;
        taskElement.style.height = `${height}px`;
        
        taskElement.innerHTML = `
            <div class="task-header">
                <span class="task-title">${task.title}</span>
                <div class="task-actions">
                    <button class="task-action-btn" onclick="dayPlanner.toggleTaskComplete('${task.id}')" 
                            aria-label="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                        ${task.completed ? '↩️' : '✅'}
                    </button>
                    <button class="task-action-btn" onclick="dayPlanner.showEditTaskModal('${task.id}')" 
                            aria-label="Edit task">✏️</button>
                    <button class="task-action-btn" onclick="dayPlanner.deleteTask('${task.id}')" 
                            aria-label="Delete task">🗑️</button>
                </div>
            </div>
            <div class="task-time">${task.startTime} - ${task.endTime}</div>
            ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
        `;
        
        // Add drag and drop functionality
        this.addDragAndDrop(taskElement, task);
        
        document.getElementById('tasksContainer').appendChild(taskElement);
    }

    renderCompletedTasks() {
        const completedTasksSection = document.getElementById('completedTasksSection');
        const completedTasksList = document.getElementById('completedTasksList');
        
        const currentDateKey = this.currentDate.toDateString();
        const completedTasks = Array.from(this.tasks.values())
            .filter(task => {
                const taskDate = task.date || task.createdAt;
                return new Date(taskDate).toDateString() === currentDateKey;
            })
            .filter(task => task.completed);
        
        if (completedTasks.length > 0 && this.showCompleted) {
            completedTasksSection.style.display = 'block';
            completedTasksList.innerHTML = '';
            
            completedTasks.forEach(task => {
                const completedTaskElement = document.createElement('div');
                completedTaskElement.className = 'completed-task-item';
                completedTaskElement.innerHTML = `
                    <div class="completed-task-info">
                        <div class="completed-task-title">${task.title}</div>
                        <div class="completed-task-time">${task.startTime} - ${task.endTime}</div>
                    </div>
                    <button class="btn btn-secondary" onclick="dayPlanner.toggleTaskComplete('${task.id}')">
                        Mark Incomplete
                    </button>
                `;
                completedTasksList.appendChild(completedTaskElement);
            });
        } else {
            completedTasksSection.style.display = 'none';
        }
    }

    // Drag and Drop
    addDragAndDrop(taskElement, task) {
        let isDragging = false;
        let startY = 0;
        let startTop = 0;
        
        taskElement.addEventListener('mousedown', (e) => {
            if (e.target.closest('.task-actions')) return;
            
            isDragging = true;
            startY = e.clientY;
            startTop = parseInt(taskElement.style.top);
            taskElement.classList.add('dragging');
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaY = e.clientY - startY;
            const newTop = Math.max(0, startTop + deltaY);
            
            // Snap to time slots (60px per hour)
            const snappedTop = Math.round(newTop / 60) * 60;
            taskElement.style.top = `${snappedTop}px`;
        });
        
        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            
            isDragging = false;
            taskElement.classList.remove('dragging');
            
            // Update task times based on new position
            const newTop = parseInt(taskElement.style.top);
            const startHour = 0;
            const newStartMinutes = startHour * 60 + (newTop / 60) * 60;
            const duration = this.timeToMinutes(task.endTime) - this.timeToMinutes(task.startTime);
            
            const newStartTime = this.minutesToTime(newStartMinutes);
            const newEndTime = this.minutesToTime(newStartMinutes + duration);
            
            // Check for conflicts
            if (!this.hasTimeConflict(newStartTime, newEndTime, task.id)) {
                task.startTime = newStartTime;
                task.endTime = newEndTime;
                this.saveTasks();
                this.showNotification('Task time updated', 'success');
            } else {
                // Revert position if there's a conflict
                const originalTop = (this.timeToMinutes(task.startTime) - startHour * 60) * (60 / 60);
                taskElement.style.top = `${originalTop}px`;
                this.showNotification('Cannot move task - time conflict detected', 'warning');
            }
        });
    }

    minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    formatTimeForInput(date) {
        return date.toTimeString().slice(0, 5);
    }

    // Search and Filter
    onSearchInput(event) {
        this.searchQuery = event.target.value.toLowerCase();
        console.log('Search query:', this.searchQuery);
        this.renderSchedule();
    }

    performSearch() {
        // Search functionality is handled in real-time via onSearchInput
    }

    onPriorityFilterChange(event) {
        this.priorityFilter = event.target.value;
        this.renderSchedule();
    }

    toggleCompletedView() {
        this.showCompleted = !this.showCompleted;
        const button = document.getElementById('completedToggle');
        button.textContent = this.showCompleted ? '❌ Hide Completed' : '✅ Show Completed';
        button.setAttribute('aria-label', this.showCompleted ? 'Hide completed tasks' : 'Show completed tasks');
        this.renderSchedule();
    }

    filterTask(task) {
        // Priority filter
        if (this.priorityFilter !== 'all' && task.priority !== this.priorityFilter) {
            console.log('Task filtered out by priority:', task.title, 'Priority:', task.priority, 'Filter:', this.priorityFilter);
            return false;
        }
        
        // Search filter
        if (this.searchQuery) {
            const titleMatch = task.title.toLowerCase().includes(this.searchQuery);
            const descriptionMatch = task.description && task.description.toLowerCase().includes(this.searchQuery);
            if (!titleMatch && !descriptionMatch) {
                console.log('Task filtered out by search:', task.title, 'Search:', this.searchQuery);
                return false;
            }
        }
        
        return true;
    }

    // Data Persistence
    saveTasks() {
        const tasksData = Array.from(this.tasks.values());
        localStorage.setItem('dayPlannerTasks', JSON.stringify(tasksData));
    }

    loadTasks() {
        try {
            const tasksData = localStorage.getItem('dayPlannerTasks');
            if (tasksData) {
                const tasks = JSON.parse(tasksData);
                this.tasks = new Map(tasks.map(task => [task.id, task]));
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.showNotification('Error loading saved tasks', 'error');
        }
    }

    // Export/Import
    exportTasks() {
        const tasksData = Array.from(this.tasks.values());
        const dataStr = JSON.stringify(tasksData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `day-planner-tasks-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Tasks exported successfully', 'success');
    }

    importTasks(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const tasksData = JSON.parse(e.target.result);
                if (Array.isArray(tasksData)) {
                    this.tasks = new Map(tasksData.map(task => [task.id, task]));
                    this.renderSchedule();
                    this.saveTasks();
                    this.showNotification(`${tasksData.length} tasks imported successfully`, 'success');
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                console.error('Error importing tasks:', error);
                this.showNotification('Error importing tasks - invalid file format', 'error');
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        const container = document.getElementById('notificationContainer');
        container.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Keyboard Shortcuts
    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + N: Add new task
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            this.showAddTaskModal();
        }
        
        // Escape: Close modal
        if (event.key === 'Escape') {
            this.hideModal();
        }
        
        // Ctrl/Cmd + S: Save (when in modal)
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            if (document.getElementById('taskModal').classList.contains('show')) {
                event.preventDefault();
                document.getElementById('taskForm').dispatchEvent(new Event('submit'));
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dayPlanner = new DayPlanner();
});
