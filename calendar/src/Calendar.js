import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css'; // For basic styling (optional)

const EventCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventText, setEventText] = useState('');
  const [eventTime, setEventTime] = useState(new Date());
  const [reminderTime, setReminderTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Request notification permission when the app starts
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Function to trigger notification
  const triggerNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("Reminder: Your quiz starts in 10 minutes!");
    }
  };

  // Trigger notification if reminder time matches
  useEffect(() => {
    const checkReminder = () => {
      events.forEach(event => {
        const delay = new Date(event.reminder).getTime() - new Date().getTime();
        if (delay > 0) {
          setTimeout(() => {
            triggerNotification();  // Trigger notification for event
          }, delay);
        }
      });
    };

    checkReminder();  // Check reminders on component mount and every time events change
  }, [events]);

  const handleDateClick = (selectedDate) => {
    setSelectedDate(selectedDate);
    setShowModal(true);
  };

  const handleAddEvent = () => {
    if (!eventText || !selectedDate) return;

    const newEvent = {
      date: selectedDate,
      text: eventText,
      time: eventTime,
      reminder: reminderTime,
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);

    // Calculate delay for notification
    const delay = new Date(reminderTime).getTime() - new Date().getTime();

    if (delay > 0 && "Notification" in window && Notification.permission === "granted") {
      setTimeout(() => {
        new Notification("Event Reminder", {
          body: `${eventText} scheduled at ${eventTime.toLocaleTimeString()}`,
        });
      }, delay);
    }

    // Reset input fields and close modal
    setEventText('');
    setEventTime(new Date());
    setReminderTime(new Date());
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEventText('');
    setEventTime(new Date());
    setReminderTime(new Date());
  };

  return (
    <div className="event-calendar-container">
      <h1>Event Calendar</h1>
      <div className="calendar-container">
        <Calendar onClickDay={handleDateClick} value={date} />
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Event</h3>
            <label>
              Event Description:
              <input
                type="text"
                value={eventText}
                onChange={(e) => setEventText(e.target.value)}
                placeholder="Enter event details"
              />
            </label>
            <br />
            <label>
              Event Time:
              <DatePicker
                selected={eventTime}
                onChange={(date) => setEventTime(date)}
                showTimeSelect
                dateFormat="Pp"
              />
            </label>
            <br />
            <label>
              Reminder Time:
              <DatePicker
                selected={reminderTime}
                onChange={(date) => setReminderTime(date)}
                showTimeSelect
                dateFormat="Pp"
              />
            </label>
            <br />
            <div className="modal-buttons">
              <button onClick={handleAddEvent}>Add Event</button>
              <button onClick={handleCloseModal} style={{ marginLeft: '10px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="event-list">
        <h3>Upcoming Events</h3>
        <ul>
          {events
            .sort((a, b) => a.date - b.date)
            .map((event, index) => (
              <li key={index}>
                <strong>{event.date.toLocaleDateString()}</strong>: {event.text} at{' '}
                {event.time.toLocaleTimeString()} (Reminder: {event.reminder.toLocaleTimeString()})
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default EventCalendar;
