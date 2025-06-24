function Turn({ winner, draw }) {
  return (
    <div className="flex justify-center">
      <h1
        className={`flex justify-center items-center bg-purple-500  p-3 h-fit w-fit rounded-2xl text-xl font-bold text-white`}
      >
        {winner ? winner + " won the game" : ""}
        {draw ? "It's a draw" : ""}
        { console.log('winner: ' , winner , 'draw: ' , draw) }
      </h1>
    </div>
  );
}

export default Turn;
