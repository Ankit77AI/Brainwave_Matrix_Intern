# 📅 Day Planner - Daily Schedule Organizer

A modern, responsive web application for organizing your daily schedule with an intuitive interface and powerful features.

## ✨ Features

### 🎯 Core Functionality
- **Daily Schedule View**: Visual timeline from 6 AM to 11 PM
- **Task Management**: Add, edit, delete, and complete tasks
- **Time Management**: Start time, end time, and duration tracking
- **Priority System**: High, Medium, Low priority with color coding
- **Conflict Detection**: Automatic warning for overlapping time slots

### 🎨 User Interface
- **Clean Design**: Minimalist, modern interface focused on readability
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Smooth Animations**: CSS animations for adding/removing tasks
- **Daily Quotes**: Motivational quotes that change daily

### 🔧 Advanced Features
- **Drag & Drop**: Rearrange tasks by dragging them on the timeline
- **Search & Filter**: Find tasks by keyword or priority level
- **Date Navigation**: Navigate between different days
- **Current Time Indicator**: Real-time line showing current time
- **Completed Tasks View**: Track and manage completed tasks

### 💾 Data Management
- **Local Storage**: Tasks persist after page reload
- **Export/Import**: Backup and restore your schedule as JSON files
- **Auto-save**: Changes are automatically saved

### ⌨️ Accessibility & Usability
- **Keyboard Navigation**: Full keyboard support with shortcuts
- **ARIA Labels**: Screen reader compatibility
- **High Contrast Mode**: Better visibility for accessibility
- **Reduced Motion**: Respects user's motion preferences

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software or frameworks required

### Installation
1. Download or clone the project files
2. Open `index.html` in your web browser
3. Start planning your day!

### File Structure
```
day-planner/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and animations
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

## 🎮 Usage Guide

### Adding Tasks
1. Click the "➕ Add New Task" button
2. Fill in the task details:
   - **Title** (required): Name of your task
   - **Start Time** (required): When the task begins
   - **End Time** (required): When the task ends
   - **Description** (optional): Additional notes
   - **Priority** (optional): High, Medium, or Low
3. Click "Save Task"

### Managing Tasks
- **Edit**: Click the ✏️ button on any task
- **Complete**: Click the ✅ button to mark as done
- **Delete**: Click the 🗑️ button to remove
- **Move**: Drag and drop tasks to new time slots

### Navigation
- **Previous Day**: Click ◀ button
- **Next Day**: Click ▶ button
- **Date Picker**: Use the date input for quick navigation
- **Today**: Automatically shows current date

### Search & Filter
- **Search**: Type keywords in the search box
- **Priority Filter**: Select specific priority levels
- **Completed Tasks**: Toggle visibility of completed items

### Keyboard Shortcuts
- **Ctrl/Cmd + N**: Add new task
- **Escape**: Close modal
- **Ctrl/Cmd + S**: Save task (when in modal)

## 🎨 Customization

### Themes
- **Light Mode**: Default clean, bright interface
- **Dark Mode**: Easy on the eyes for low-light environments
- **High Contrast**: Enhanced visibility for accessibility

### Colors
The application uses CSS custom properties for easy color customization:
- Primary: `#6366f1` (Indigo)
- High Priority: `#ef4444` (Red)
- Medium Priority: `#f59e0b` (Amber)
- Low Priority: `#10b981` (Emerald)

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full feature set with optimal layout
- **Tablet**: Touch-friendly interface with adapted spacing
- **Mobile**: Streamlined layout for small screens

## 🔒 Privacy & Data

- **Local Storage**: All data is stored locally in your browser
- **No Cloud Storage**: Your schedule remains private
- **Export Option**: Backup your data as JSON files
- **Import Option**: Restore from previously exported files

## 🛠️ Technical Details

### Built With
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: No frameworks, pure ES6+ JavaScript
- **Local Storage API**: Client-side data persistence

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance Features
- Efficient DOM manipulation
- Debounced search input
- Optimized rendering
- Minimal memory footprint

## 🐛 Troubleshooting

### Common Issues
1. **Tasks not saving**: Check if localStorage is enabled in your browser
2. **Drag and drop not working**: Ensure JavaScript is enabled
3. **Layout issues**: Try refreshing the page or clearing browser cache

### Browser Compatibility
- Enable JavaScript in your browser
- Allow localStorage permissions
- Use a modern browser version

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

### Development Setup
1. Clone the repository
2. Open in your preferred code editor
3. Make changes to HTML, CSS, or JavaScript
4. Test in multiple browsers
5. Validate HTML and CSS

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Icons and emojis for visual elements
- Google Fonts (Inter) for typography
- CSS Grid and Flexbox for modern layouts
- Local Storage API for data persistence

---

**Happy Planning! 🎯✨**

*Organize your day, achieve your goals, and make every moment count.*
