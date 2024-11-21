const styles = {
    curvedTextStyle: {
      fontWeight: 'bold',
      fill: 'white',
      fontFamily: "'Chunk Five', 'Roboto Slab', serif",
      textTransform: 'uppercase',
      letterSpacing: '0px',
    },
  };
  
  const CurvedText = () => {
    return (
      <div className="flex justify-center items-center h-auto">
        <svg
          className="w-[80%] sm:w-[60%] lg:w-[40%] h-auto"
          viewBox="0 0 500 130"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id="curvedTextPath"
            d="M50,150 a200,100 0 1,1 400,0"
            fill="transparent"
          />
          <text
            style={styles.curvedTextStyle}
            className="text-[50px] sm:text-[38px] lg:text-[50px]"
          >
            <textPath
              href="#curvedTextPath"
              startOffset="50%"
              textAnchor="middle"
            >
              Cavallo Bianco
            </textPath>
          </text>
        </svg>
      </div>
    );
  };
  
  export default CurvedText;
  