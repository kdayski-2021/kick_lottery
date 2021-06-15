pragma solidity ^0.4.21;
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
        require(IsActive && amount >= 1);
        
        ERC20Burnable token = ERC20Burnable(Token);
        
        // Метод вызван контрактом, а не кошельком. Возьмем его деньги с благодарностью и молча отвалим.
        if (tx.origin != msg.sender) { // ! это можно вставить после правки контракта монеты   && msg.sender != address(token)){
            token.transferFrom(msg.sender, address(this), amount);
            return;
        }
        
        uint256 jackpot = this.Jackpot();
        // Берем ставку не выше jackport, остальное возвращаем обратно, чтобы не оставлять на контракте approved монеты.
        
        token.transferFrom(msg.sender, address(this), amount);

        if (jackpot < amount){
            uint256 back = amount.sub(jackpot);
            token.transferFrom(address(this), msg.sender, back);
            amount = jackpot;
        }

        // Случайное число = (время + jackpot + адрес игрока) % 100
        uint256 rnd = now.add(jackpot).add(uint256(uint160(address(msg.sender)))).add(uint256(blockhash(0))).mod(100);

        LotteryRound memory CurrentLottery = LotteryRound({
            RunAt: now,
            Jackpot: jackpot,
            
            Player: msg.sender,
            Bet: amount,
            IsWinner: rnd < 100 * amount / jackpot // Вероятность выигрыша P(a/j)
        });

        History.push(CurrentLottery);
        RoundNumber++;

        if (CurrentLottery.IsWinner){
            token.transfer(msg.sender, jackpot.div(2)); //
            PayedTotal = PayedTotal.add(jackpot.div(2));
        
            token.burn(jackpot.mul(2).div(5));
            BurnedTotal = BurnedTotal.add(jackpot.mul(2).div(5));
            return true;
        }
        
        return false;
    }

    
    // Останавливает лотерею и сжигает Джекпот .
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
        return History;
    }
}