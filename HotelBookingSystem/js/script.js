let hotel = {};

// ---------- INITIALIZE HOTEL ----------
for (let f = 1; f <= 9; f++) {
    hotel[f] = [];
    for (let r = 1; r <= 10; r++) {
        hotel[f].push({ number: f * 100 + r, booked: false });
    }
}

hotel[10] = [];
for (let r = 1; r <= 7; r++) {
    hotel[10].push({ number: 1000 + r, booked: false });
}

// ---------- RENDER HOTEL ----------
function renderHotel() {
    const hotelDiv = document.getElementById("hotel");
    hotelDiv.innerHTML = "";

    for (let f = 1; f <= 10; f++) {
        const floorDiv = document.createElement("div");
        floorDiv.className = "floor";

        hotel[f].forEach(room => {
            const roomDiv = document.createElement("div");
            roomDiv.className = "room" + (room.booked ? " booked" : "");
            roomDiv.textContent = room.number;
            floorDiv.appendChild(roomDiv);
        });

        hotelDiv.appendChild(floorDiv);
    }
}

renderHotel();

// ---------- RANDOM OCCUPANCY ----------
function randomOccupancy() {
    for (let f in hotel) {
        hotel[f].forEach(room => room.booked = Math.random() < 0.3);
    }
    renderHotel();
}

// ---------- RESET ----------
function resetBooking() {
    for (let f in hotel) {
        hotel[f].forEach(room => room.booked = false);
    }
    renderHotel();
    document.getElementById("numRooms").value = "";
}

// ---------- TRAVEL TIME ----------
function getTravelTimeBetweenRooms(rooms) {
    let floors = rooms.map(r => Math.floor(r.number / 100));
    let roomNos = rooms.map(r => r.number % 100);

    let vertical = (Math.max(...floors) - Math.min(...floors)) * 2;
    let horizontal = Math.max(...roomNos) - Math.min(...roomNos);

    return vertical + horizontal;
}

// ---------- SAME FLOOR BEST ----------
function getBestSameFloorRooms(available, num) {
    available.sort((a, b) => a.number - b.number);

    let best = null;
    let minDistance = Infinity;

    for (let i = 0; i <= available.length - num; i++) {
        let combo = available.slice(i, i + num);
        let roomNos = combo.map(r => r.number % 100).sort((a, b) => a - b);
        let distance = roomNos[roomNos.length - 1] - roomNos[0];

        if (distance < minDistance) {
            minDistance = distance;
            best = combo;
        }
    }
    return best;
}

// ---------- BOOK ROOMS ----------
function bookRooms() {
    const input = document.getElementById("numRooms");
    const num = parseInt(input.value);

    if (isNaN(num) || num < 1 || num > 5) {
        alert("Enter rooms between 1 and 5");
        input.value = "";
        return;
    }

    let selectedRooms = null;

    // STEP 1: SAME FLOOR
    for (let f = 1; f <= 10; f++) {
        let available = hotel[f].filter(r => !r.booked);
        if (available.length >= num) {
            selectedRooms = getBestSameFloorRooms(available, num);
            break;
        }
    }

    // STEP 2: CROSS FLOOR
    if (!selectedRooms) {
        let allAvailable = [];
        for (let f = 1; f <= 10; f++) {
            hotel[f].forEach(r => {
                if (!r.booked) allAvailable.push(r);
            });
        }

        if (allAvailable.length < num) {
            alert("Not enough rooms available");
            return;
        }

        allAvailable.sort((a, b) => a.number - b.number);

        let minTime = Infinity;
        for (let i = 0; i <= allAvailable.length - num; i++) {
            let combo = allAvailable.slice(i, i + num);
            let time = getTravelTimeBetweenRooms(combo);

            if (time < minTime) {
                minTime = time;
                selectedRooms = combo;
            }
        }
    }

    // FINAL BOOK
    selectedRooms.forEach(r => r.booked = true);
    let travelTime = getTravelTimeBetweenRooms(selectedRooms);

    alert(
        `Booked Rooms: ${selectedRooms.map(r => r.number).join(", ")}\n` +
        `Total Travel Time: ${travelTime} minutes`
    );

    input.value = "";
    renderHotel();
}
