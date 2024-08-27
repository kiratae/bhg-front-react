
const DMGameAction = {
    /**
     * Only host player can start game.
     */
    StartGame: 1,
    /**
     * Killer choose civilian to kill.
     */
    KillerChooseTarget: 2,
    /**
     * Dog Jarvis choose player to protect.
     */
    DogJarvisChooseTarget: 3,
    /**
     * Dead civilian choose real evidence.
     */
    DeadChooseEvidence: 4,
    /**
     * Killer choose 2 fake evidences.
     */
    KillerChooseEvidences: 5,
    /**
     * All players vote out for suspects.
     */
    VoteKillerOut: 6,
    /**
     * All players vote to confirm kill suspect.
     */
    VoteConfirmKill: 7
};

export default DMGameAction;