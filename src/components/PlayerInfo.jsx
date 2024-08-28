import PlayerRole from "../models/PlayerRole";
import PlayerStatus from "../models/PlayerStatus";


const PlayerInfo = (props) => {
    const { user } = props;

    return (
        <h3 className="text-lg">
            You're <b>{PlayerRole.getRoleName(user.roleId)}</b>{user.statusId === PlayerStatus.Dead ? ' and DEATH!' : ''}
        </h3>);
}

export default PlayerInfo;