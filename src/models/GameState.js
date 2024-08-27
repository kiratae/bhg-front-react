
class GameState {
    static Waiting = 1;
    static Start = 2;
    static KillerTurn = 3;
    static ProtectorTurn = 4;
    static LeaveDyingMessageTime = 5;
    static LeaveFakeEvidenceTime = 6;
    static DiscussTime = 7;
    static VoteOutTime = 8;
    static VoteKillTime = 9;
    static GameOver = 10;
};

export default GameState;