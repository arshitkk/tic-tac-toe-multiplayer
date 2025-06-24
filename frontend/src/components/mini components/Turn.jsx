function Turn({ playerSymbol, turn }) {
  return (
    <div className="flex justify-center">
      <h1
        className={`flex justify-center items-center text-black  p-2 h-fit w-fit rounded-2xl text-xl font-bold bg-white`}
      >
        {" "}
        {/* if pkayer symbol is equal to turn then its your turn else its opponent's turn */}
        {playerSymbol === turn ? "Your Turn" : "Opponent's Turn"}
      </h1>
    </div>
  );
}

export default Turn;
