
const roleNames = {
    0: "Unknown",
    1: "Civilian 🙍‍♂️",
    2: "Killer 🥷",
    3: "Jarvis The Husky 🐶",
    4: "Private Detective 🕵️",
  };

class PlayerRole {
    static Unknown = 0;
    static Civilian = 1;
    static Killer = 2;
    static DogJarvis = 3; // Guard
    static Detective = 4; // Guard

    static getRoleName = (roleId) => roleNames[roleId];
}

export default PlayerRole;