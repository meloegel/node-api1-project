const express = require('express');
const shortid = require('shortid');

const server = express();

server.use(express.json());

let users = [
    {
        id: shortid.generate(),
        name: "Jane Doe",
        bio: "Not Tarzan's Wife, another Jane"
    },
    {
        id: shortid.generate(),
        name: "John Doe",
        bio: "Might actually be Tarzan"
    },
    {
        id: shortid.generate(),
        name: "Delete Me",
        bio: "Expendable"
    }

]

server.post('/api/users', (req, res) => {
    const newUser = req.body;
    if (!newUser.name || !newUser.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } else if (newUser === null) {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
    } else {
        newUser.id = shortid.generate();
        users.push(newUser);
        res.status(201).json(users)
    }

})

server.get('/api/users', (req, res) => {
    if (!users) {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." })
    } else {
        res.status(200).json(users)
    }
})

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    let found = users.find(user => user.id === id)
    if (found) {
        res.status(200).json(found)
    } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
})

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    if (id) {
        user = users.filter(user => user.id !== id);
        res.status(200).json(user)
    } else {
        res.status(404).json({ errorMessage: "The user could not be removed" })
    }
})

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    let found = users.find(user => user.id === id);
    if (!changes.name || !changes.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } else if (found) {
        found = Object.assign(found, changes)
        if (found) {
            res.status(200).json(found)
        } else {
            res.status(500).json({ errorMessage: "The user information could not be modified." })
        }
    } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
})

const PORT = 8000;
server.listen(PORT, () => console.log(`server running on port ${PORT}`));