import { useEffect, useState, useCallback } from 'react';
import ReactCurvedText from 'react-curved-text';

const CurvedText = () => {
    const [fontSize, setFontSize] = useState(50);
    const [startOffset, setStartOffset] = useState(25);
    const [cx, setCx] = useState(250);
    const [rx, setRx] = useState(205);

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const handleScreenSize = useCallback(
        debounce(() => {
            const width = window.innerWidth;
            let newFontSize = 50;
            let newStartOffset = 25;
            let newCx = 250;
            let newRx = 205;

            if (width <= 768) {
                newFontSize = 36;
                newStartOffset = width / 10;
                newCx = width / 2;
                newRx = 150;
            } else {
                newFontSize = 50;
                newStartOffset = 25;
                newCx = 250;
                newRx = 205;
            }

            setFontSize(newFontSize);
            setStartOffset(newStartOffset);
            setCx(newCx);
            setRx(newRx);
        }, 150),
        []
    );

    useEffect(() => {
        handleScreenSize();
        window.addEventListener('resize', handleScreenSize);
        return () => {
            window.removeEventListener('resize', handleScreenSize);
        };
    }, [handleScreenSize]);

    const curvedContainerStyle = {...styles.curvedTextStyle,fontSize:fontSize}

    return (
        <ReactCurvedText
            width={500}
            height={123}
            cx={cx}
            cy={150}
            rx={rx}
            ry={100}
            startOffset={startOffset}
            reversed={true}
            text="CAVALLO BIANCO"
            textProps={{
                style:curvedContainerStyle
            }}
            textPathProps={null}
            tspanProps={null}
            ellipseProps={null}
            svgProps={null}
        />
    );
};

export default CurvedText;

const styles = {
    curvedTextStyle: {
        fontWeight: 'bold',
        fill: 'white',
        fontFamily: "'Chunk Five', 'Roboto Slab', serif",
        textTransform: 'uppercase',
        letterSpacing: '0px'
    }
}
