import React, { useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

const EventComponent = ({ event, onClick }) => (
  <div onClick={() => onClick(event)} style={{ width: '100%', height: '100%', cursor: 'pointer' }}>
    {event.icon && <img src={event.icon} alt="Icon" style={{ maxWidth: '64px', maxHeight: '64px' }} />}
    <Stack spacing={1}>
      <Typography variant="body1">Ticket Cost: ${event.ticketCost}</Typography>
      <Typography variant="body1">Available Tickets: {event.tickets}</Typography>
      <Typography variant="body1">Capacity: {event.capacity}</Typography>
    </Stack>
  </div>
);

const EventDialog = ({ open, event, onClose }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{event?.title}</DialogTitle>
    <DialogContent>
      <Typography>{event?.desc}</Typography>
      <Stack spacing={1}>
        <Typography variant="body1">Ticket Cost: ${event?.ticketCost}</Typography>
        <Typography variant="body1">Available Tickets: {event?.tickets}</Typography>
        <Typography variant="body1">Capacity: {event?.capacity}</Typography>
        <Typography variant="body1">Location: {event?.location}</Typography>
        <Typography variant="body1">Organizer: {event?.organizer}</Typography>
        <Typography variant="body1">Icon URL: {event?.icon}</Typography>
        <Typography variant="body1">Remaining Tickets: {event?.remainingTickets}</Typography>
      </Stack>
      {event?.icon && <img src={event.icon} alt="Icon" style={{ maxWidth: '100%', height: 'auto' }} />}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

const Page = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Magic: The Gathering Tournament',
      start: new Date(2024, 0, 10, 9, 0), // January 10th, 9:00 AM
      end: new Date(2024, 0, 11, 18, 0), // January 11th, 6:00 PM
      desc: 'Join us for an epic Magic: The Gathering tournament! Compete against other players and showcase your skills. Organized by TCG Masters.',
      location: 'TCG Arena',
      organizer: 'TCG Masters',
      icon: 'https://lotsofcards.com/cdn/shop/files/81aa9e7e65162b4a606bd91f7f552cd5.webp?v=1705847695',
      tickets: 100,
      remainingTickets: 80,
      ticketCost: 20, // $20
      capacity: 120,
    },
    {
      id: 2,
      title: 'Yu-Gi-Oh! Duelist Challenge',
      start: new Date(2024, 1, 2, 10, 0), // February 2nd, 10:00 AM
      end: new Date(2024, 1, 17, 20, 0), // February 17th, 8:00 PM
      desc: 'Test your deck-building prowess and strategic thinking in our Yu-Gi-Oh! Duelist Challenge. Prizes await the top performers! Organized by Duelist Pro League.',
      location: 'Duelist Arena',
      organizer: 'Duelist Pro League',
      icon: 'https://lotsofcards.com/cdn/shop/files/086d411c-603d-481e-aa24-8afdc6bc92a8.webp?v=1705847714',
      tickets: 150,
      remainingTickets: 130,
      ticketCost: 15, // $15
      capacity: 200,
    },
    {
      id: 3,
      title: 'Pokémon TCG League Day',
      start: new Date(2024, 0, 12, 11, 0), // January 12th, 11:00 AM
      end: new Date(2024, 0, 12, 17, 0), // January 12th, 5:00 PM
      desc: 'Join fellow Pokémon TCG enthusiasts for a fun-filled League Day. Trade cards, battle opponents, and earn league points! Organized by Pokémon TCG Club.',
      location: 'Pokémon Arena',
      organizer: 'Pokémon TCG Club',
      icon: 'https://lotsofcards.com/cdn/shop/files/pikachu_Pokemon.png?v=1705847432',
      tickets: 80,
      remainingTickets: 50,
      ticketCost: 10, // $10
      capacity: 100,
    },
    {
      id: 4,
      title: 'Digimon TCG Launch Party',
      start: new Date(2024, 0, 14, 18, 0), // January 14th, 6:00 PM
      end: new Date(2024, 0, 14, 21, 0), // January 14th, 9:00 PM
      desc: 'Celebrate the launch of the new Digimon TCG with fellow fans! Participate in demo games, win exclusive promos, and more. Organized by Digimon TCG Club.',
      location: 'Digimon Plaza',
      organizer: 'Digimon TCG Club',
      icon: 'https://lotsofcards.com/cdn/shop/files/digimon.webp?v=1705847729',
      tickets: 120,
      remainingTickets: 100,
      ticketCost: 25, // $25
      capacity: 150,
    },
  ]);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    desc: '',
    ticketCost: '',
    tickets: '',
    capacity: '',
    startDate: new Date(),
    startTime: moment().format('HH:mm'),
    location: '',
    organizer: '',
    icon: '',
    remainingTickets: '',
  });

  const localizer = momentLocalizer(moment);

  const handleEventClick = (event) => {
    setIsEditing(true);
    setSelectedEvent(event);
    setFormData({ ...event, startDate: event.start, startTime: moment(event.start).format('HH:mm') });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClose = () => {
    setSelectedEvent(null);
    setIsEditing(false);
    resetFormData();
  };

  const handleAddEditEvent = () => {
    const startDateTime = moment(`${formData.startDate} ${formData.startTime}`, 'YYYY-MM-DD HH:mm').toDate();
    const endDateTime = moment(startDateTime).add(2, 'hours').toDate();  // Adjusted for clarity
    const eventDetails = {
      id: formData.id || events.length + 1,
      ...formData,
      start: startDateTime,
      end: endDateTime,
      ticketCost: parseFloat(formData.ticketCost),
      tickets: parseInt(formData.tickets, 10),
      capacity: parseInt(formData.capacity, 10),
    };

    if (isEditing) {
      setEvents(events.map(event => event.id === formData.id ? eventDetails : event));
    } else {
      setEvents([...events, eventDetails]);
    }

    handleClose();
  };

  const resetFormData = () => {
    setFormData({
      id: null,
      title: '',
      desc: '',
      ticketCost: '',
      tickets: '',
      capacity: '',
      startDate: new Date(),
      startTime: moment().format('HH:mm'),
      location: '',
      organizer: '',
      icon: '',
      remainingTickets: '',
    });
  };

  return (
    <>
      <Head>
        <title>Events | TCGSync v2</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Typography variant="h4">Events</Typography>
            <TextField
              label="Event Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Event Description"
              name="desc"
              value={formData.desc}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              label="Ticket Cost ($)"
              name="ticketCost"
              type="number"
              value={formData.ticketCost}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Number of Tickets"
              name="tickets"
              type="number"
              value={formData.tickets}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              value={moment(formData.startDate).format('YYYY-MM-DD')}
              onChange={e => setFormData({ ...formData, startDate: new Date(e.target.value) })}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Start Time"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={e => setFormData({ ...formData, startTime: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Organizer"
              name="organizer"
              value={formData.organizer}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Icon URL"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            <Button onClick={handleAddEditEvent}>{isEditing ? 'Update Event' : 'Add Event'}</Button>
            <div style={{ height: '700px', width: '100%' }}>
              <Calendar
                localizer={localizer}
                events={events}
                views={['month', 'week', 'day', 'agenda']}
                defaultDate={new Date()}
                selectable={true}
                onSelectEvent={handleEventClick}
                components={{ event: (props) => <EventComponent {...props} onClick={handleEventClick} /> }}
              />
            </div>
          </Stack>
        </Container>
      </Box>
      <EventDialog
        open={!!selectedEvent}
        event={selectedEvent}
        onClose={handleClose}
      />
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
