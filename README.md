# Trello Web

## 🌟 Introduction
**Trello Web** is a personal project that replicates core functionalities of Trello, enabling users to organize tasks visually through boards, columns, and cards. This project focuses on enhancing the user experience with features like drag-and-drop functionality, authentication, and dark-light mode toggling.

---

## 🎯 Features
- **Board Management**: Create, edit, and delete boards.
- **Card & Column Management**:
  - Add, update, and remove cards or columns within a board.
  - Drag and drop cards between columns or rearrange columns within a board.
- **User Authentication**:
  - JWT-based secure authentication with encrypted password storage.
  - Register and log in functionality.
- **Dark-Light Mode**: Switch between light and dark themes for a better user experience.
- **Collaboration Tools**:
  - Invite other users to boards.
  - Comment on cards for effective collaboration.

---

## 🛠 Tech Stack
- **Frontend**:
  - ReactJS, Redux
  - Styling: Material-UI (MUI), SCSS
  - Drag-and-drop: `dnd-kit`
- **Backend**:
  - Node.js, Express.js
  - Authentication: JSON Web Tokens (JWT)
- **Database**:
  - MongoDB (NoSQL database for scalability and flexibility)
- **Other Tools**:
  - Git (Version control)
  - Postman (API testing)


## ⚙️ Installation & Setup

### Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: v18+ (LTS version recommended)
- **MongoDB**: Ensure MongoDB is running locally or use a cloud MongoDB service.


📖 Usage
1. User Registration & Login

    Register as a new user by providing a valid email and secure password.
    Log in using your credentials to access your boards.

2. Creating Boards

    Click on the "New Board" button to create a new board.
    Provide a name for the board and start adding columns and cards.

3. Managing Cards and Columns

    Use the "Add Column" button to create columns in your board.
    Add cards to any column and rearrange them via drag-and-drop.

4. Collaboration

    Invite team members to collaborate on your boards.
    Add comments to cards to share ideas or updates.

5. Dark-Light Mode

    Toggle between light and dark themes using the switch at the top right corner.


