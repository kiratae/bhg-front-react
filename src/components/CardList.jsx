import CardStatus from "../models/CardStatus";

const CardList = (props) => {
    const { room } = props;

    const getGameCards = () => {
        var sets = [];
        for (var i = 1; i <= room.gameRound; i++) {
            sets.push({ round: i, cards: room.cards[i].filter((card) => card.statusId === CardStatus.FakeEvidence || card.statusId === CardStatus.RealEvidence) });
        }
        return sets;
    };

    const getUnselectedCards = (gameRound) => {
        return room.cards[gameRound].filter((card) => card.statusId === CardStatus.Discarded);
    };

    return (
        <>
            {getGameCards().map(({ round, cards }) => (
                <>
                    <div className="my-2">Phase: {round}</div>
                    <div className="grid grid-cols-3 gap-4">
                        {cards.map((card) => (
                            <div
                                key={`${round}_${card.cardId}`}
                                className="rounded-xl border-grey-300 border-4"
                            >
                                <img
                                    src={`${process.env.REACT_APP_API_END_POINT}${card.fileName.replace('~/', '/')}`}
                                    alt={`Card ${card.cardId}`}
                                    className="w-full h-full object-cover rounded-lg"
                                    style={{ width: "80px", height: "120px" }}
                                />
                            </div>
                        ))}
                    </div>
                </>
            ))}
            <div className="my-2">Not selectd cards</div>
            <div className="grid grid-cols-3 gap-4">
                {getUnselectedCards(room.gameRound).map((card) => (
                    <div
                        key={card.cardId}
                        className="rounded-xl border-grey-300 border-2"
                    >
                        <img
                            src={`${process.env.REACT_APP_API_END_POINT}${card.fileName.replace('~/', '/')}`}
                            alt={`Card ${card.cardId}`}
                            className="w-full h-full object-cover rounded-lg"
                            style={{ width: "60px", height: "90px" }}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}

export default CardList;