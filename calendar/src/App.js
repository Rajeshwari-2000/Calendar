import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

const EventCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventText, setEventText] = useState('');
  const [eventTime, setEventTime] = useState(new Date());
  const [reminderTime, setReminderTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Function to create a notification
  const createNotification = (event) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Event Reminder", {
        body: `Reminder: ${event.text} at ${event.time.toLocaleTimeString()}`,
      });
    } else {
      alert(`Reminder: ${event.text} at ${event.time.toLocaleTimeString()}`);
    }
  };

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

    setEvents([...events, newEvent]);

    // Calculate delay for notification
    const currentTime = new Date().getTime();
    const reminderTimeMs = new Date(reminderTime).getTime();
    const delay = reminderTimeMs - currentTime;

    if (delay > 0) {
      setTimeout(() => createNotification(newEvent), delay);
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
    <div>
      <h1>Event Calendar</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
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
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleAddEvent}>Add Event</button>
              <button onClick={handleCloseModal} style={{ marginLeft: '10px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3>Upcoming Events</h3>
        <ul>
          {events.map((event, index) => (
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
