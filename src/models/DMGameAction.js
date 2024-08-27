
class DMGameAction {
    /**
     * Only host player can start game.
     */
    static StartGame = 1;
    /**
     * Killer choose civilian to kill.
     */
    static KillerChooseTarget = 2;
    /**
     * Dog Jarvis choose player to protect.
     */
    static DogJarvisChooseTarget = 3;
    /**
     * Dead civilian choose real evidence.
     */
    static DeadChooseEvidence = 4;
    /**
     * Killer choose 2 fake evidences.
     */
    static KillerChooseEvidences = 5;
    /**
     * All players vote out for suspects.
     */
    static VoteKillerOut = 6;
    /**
     * All players vote to confirm kill suspect.
     */
    static VoteConfirmKill = 7
};

export default DMGameAction;