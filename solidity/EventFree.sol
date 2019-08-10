pragma solidity >=0.4.22 <0.6.0;

import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/token/ERC20/ERC20Detailed.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/math/SafeMath.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/ownership/Ownable.sol";

contract EventFree is Ownable {
    ERC20Detailed token;
    using SafeMath for uint256;
    string public eventName;
    string public eventAddress;
    string public eventDescription;
    uint256 public startDate;
    uint256 public endDate;
    uint256 public quota;
    address[] public participants;
    mapping (address => Participant) _participantsMap;
    enum EventStatus {CREATED,OPEN,CLOSE}
    EventStatus public status;

    
    struct Participant {
        string email;
        string name;
        bool register;
        bool checkIn;
    }
    
    constructor (ERC20Detailed _token,
                string memory _eventName, 
                string memory _eventAddress,
                string memory _eventDescription,
                uint256 _startDate,
                uint256 _endDate,
                uint256 _quota) public {
        token = _token;
        eventName = _eventName;
        eventAddress = _eventAddress;
        eventDescription = _eventDescription;
        startDate = _startDate;
        endDate = _endDate;
        quota = _quota;
        status= EventStatus.CREATED;
    }
    
    function register(string memory _email,string memory _name) public returns (bool){
        require(status == EventStatus.OPEN, "status must open");
        participants.push(msg.sender);
        Participant memory participant = Participant(_email,_name, true, false);
        _participantsMap[msg.sender]=participant;
        if(participants.length==quota){
            status = EventStatus.CLOSE;
        }
        return true;
    }
    
    function rewards() public view returns (uint256,uint256,string memory) {
        uint256 balanceContract = token.balanceOf(address(this));
        return (balanceContract,token.decimals(),token.symbol());
    }
    
    function isRegister(address _participant) public view returns (bool) {
        return _participantsMap[_participant].register;
    }
    
    function isCheckIn(address _participant) public view returns (bool) {
        return _participantsMap[_participant].checkIn;
    }
    
     function openEvent() public onlyOwner  returns (bool) {
        require(status == EventStatus.CREATED, "status must CREATED");
        require(token.balanceOf(address(this)) >0, "balance cannot empty");
        status=EventStatus.OPEN;
        return true;
    }
    
     function closeEvent() public onlyOwner  returns (bool) {
        require(status == EventStatus.OPEN, "status must OPEN");
        status=EventStatus.CLOSE;
        return true;
    }
    
    function checkIn(address _participantAddress) public onlyOwner  returns (bool) {
        if(_participantAddress !=address(0)) {
            _participantsMap[_participantAddress].checkIn = true;
            return true;
        }
        return false;
    }
    
    function disburse() public onlyOwner returns (bool) {
        require(status==EventStatus.CLOSE,"status must close");
        uint256 balanceContract = token.balanceOf(address(this));
        require(balanceContract>0);
        
        uint256 amount = balanceContract.div(participants.length);
        for(uint i = 0; i< participants.length; i++){
              if(_participantsMap[participants[i]].checkIn){
                token.transfer(participants[i], amount);
              }
        }
        return true;
    }
    
    function getUser(address _participant) public view returns (string memory,string memory,bool) {
      Participant memory participant = _participantsMap[_participant];
      return (participant.email,participant.name, participant.checkIn);
    }
    
}