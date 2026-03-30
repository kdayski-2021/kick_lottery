pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


contract owned {
    constructor() public { owner = msg.sender; }
    address public owner;

    // This contract only defines a modifier but does not use
    // it: it will be used in derived contracts.
    // The function body is inserted where the special symbol
    // `_;` in the definition of a modifier appears.
    // This means that if the owner calls this function, the
    // function is executed and otherwise, an exception is
    // thrown.
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
}
  
library SafeMath {

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b);

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0);
        uint256 c = a / b;
        
	return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        uint256 c = a - b;

        return c;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);

        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0);
        return a % b;
    }
}
  
  
interface ERC20Burnable {
	function balanceOf(address _owner) external view returns (uint balance) ;
	function transfer(address _recipient, uint _value) external  ;
	function transferFrom(address _from, address _to, uint _value) external ;
	function burn(uint256 amount) external;
	function approve(address _spender, uint _value) external;
}

/*
    Контракт быстрой лотереи токенов.
*/
contract KikLottery is owned {
    using SafeMath for uint256;

    // Информация о раунде лотереи (хранится в истории).
    struct LotteryRound{
        uint256 RunAt;
        address Player;
        bool IsWinner;
        uint256 Bet;

        uint256 Jackpot;
    }

    // Каким токеном играем.
    address public Token;
    
    // Вся история лотереи.
    LotteryRound[] public History;
    
    // Текущий раунд.
    uint256 public RoundNumber;
    
    // Всего сожгли токенов.
    uint256 public BurnedTotal;
    
    // Всего выплатили токенов.
    uint256 public PayedTotal;
    
    // Активна ли лотерея. Если СТОПКРАН дернули то лотерея навсегда останавливается.
    bool public IsActive; // Is lottery active;

    constructor(address token) public
    {
        owner = msg.sender;
        Token = token;
        IsActive = true;
        BurnedTotal = 0;
        PayedTotal = 0;
        RoundNumber = 0;
    }
    
    
    // Играть. Сдлеать ставку $amount токенов. !Должны быть предварительно approved этому контракту! 
    function play(uint256 amount) public returns (bool)
    {
        require(IsActive);

        // --- Вероятность выигрыша ранва P(a / (a + j)), если надо вероятность P(a/j), то код(2 строки) надо перенести -->
        ERC20Burnable a = ERC20Burnable(Token);
        a.transferFrom(msg.sender, address(this), amount);

        uint256 jackpot = this.Jackpot();
        
        // --> сюда.

        // Случайное число = (время + jackpot + адрес игрока) % 100
        uint256 rnd = now.add(jackpot).add(uint256(uint160(address(msg.sender)))).mod(100);

        LotteryRound memory CurrentLottery = LotteryRound({
            RunAt: now,
            Jackpot: jackpot,
            
            Player: msg.sender,
            Bet: amount,
            IsWinner: rnd < 100 * amount / jackpot
        });

        History.push(CurrentLottery);
        RoundNumber++;

        if (CurrentLottery.IsWinner){
            a.transfer(msg.sender, jackpot.div(2)); //
            PayedTotal = PayedTotal.add(jackpot.div(2));
        
            a.burn(jackpot.mul(2).div(5));
            BurnedTotal = BurnedTotal.add(jackpot.mul(2).div(5));
            return true;
        }
        
        return false;
    }

    
    // Останавливает лотерею и возвращает деньги всем участникам. Джекпот сжигает.
    function Kill() public {
        require(msg.sender == owner && IsActive);
        IsActive = false;
        ERC20Burnable token = ERC20Burnable(Token);

        // Сжигаем остаток
        BurnedTotal = BurnedTotal.add(this.Jackpot()); 
        token.burn(this.Jackpot());
    }

    // Текущий джекпот.
    function Jackpot() public view returns (uint256){
         return ERC20Burnable(Token).balanceOf(address(this));
    }
    
    // Получить всю историю одним разом.
    function getHistory() public view returns (LotteryRound[]data){
        return abi.decode(History, (uint256, address, bool, uint256, uint256));
    }
}