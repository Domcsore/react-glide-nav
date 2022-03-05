import React, {useState} from 'react';

const Navbar = ({children, className, style}) => {
  const [loading, setLoading] = useState(true);
  const [activeLink, setActiveLink] = useState(0);
  const [indicatorPosition, setIndicatorPosition] = useState(0);
  const [prevIndicatorPosition, setPrevIndicatorPosition] = useState(0);
  const [indicatorColour, setIndicatorColour] = useState({r: 0, g: 0, b: 0});
  const [sizeChanged, setSizeChanged] = useState(false);
  const [navWidth, setNavWidth] = useState(0);
  const navRef = React.createRef(null);

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSizeChanged(true);
    });
    resizeObserver.observe(navRef.current);

    window.setTimeout(() => {
      setLoading(false);
    }, 300)

    return () => {resizeObserver.disconnect()}
  }, [])

  React.useEffect(() => {
    if (sizeChanged) {
      setNavWidth(navRef.current.clientWidth);
    }
  }, [sizeChanged])

  const handleActiveLinkChange = (index) => {
    setActiveLink(index);
  }

  const handleIndicatorPosition = (nextPosition) => {
    setPrevIndicatorPosition(indicatorPosition);
    setIndicatorPosition(nextPosition);
  }

  return (
    <nav className={className} style={{position: 'relative', ...style}} ref={navRef}>
      {React.Children.map(children, (child, index) => React.cloneElement(child, {index, active: activeLink === index, sizeChanged, setSizeChanged, handleActiveLinkChange, handleIndicatorPosition, setIndicatorColour, key: "child" + index}))}
      <Indicator position={indicatorPosition} prevPosition={prevIndicatorPosition} colour={indicatorColour} navWidth={navWidth} loading={loading} />
    </nav>
  )
}

const Link = (({children, className, style , active, index, handleActiveLinkChange, handleIndicatorPosition, sizeChanged, setSizeChanged, colour, setIndicatorColour}) => {
  const linkRef = React.useRef(null);

  const linkStyle = {
    padding: '1em',
    display: 'inline-block',
    color: active ? `rgb(${colour.r},${colour.g},${colour.b})` : 'inherit',
    transition: 'color 200ms',
  }

  React.useEffect(() => {
    if (active || sizeChanged) {
      const currentLink = linkRef.current;
      const indicatorPosition = currentLink.offsetLeft + Math.floor(currentLink.clientWidth / 2);
      handleIndicatorPosition(indicatorPosition);
      setIndicatorColour(colour);
      if (sizeChanged) setSizeChanged(false);
    }
  }, [active, sizeChanged])

  return (
    <a href="#" className={className} style={{...linkStyle, ...style}} onClick={() => handleActiveLinkChange(index)} ref={linkRef}>
      {children}
    </a>
  )
});

const Indicator = ({position, prevPosition, colour, navWidth, loading}) => {
  const style = {
    position: 'absolute', 
    transform: `translate(0, -100%)`,
    height: '10px',
    borderRadius: '10px',
    backgroundColor: `rgb(${colour.r},${colour.g},${colour.b})`,
    top: '100%', 
    left: `${position-5}px`,
    right: `${navWidth-position-5}px`,
    transition: `opacity 200ms, left 200ms ${position > prevPosition ? 100 : 0}ms, right 200ms ${position > prevPosition ? 0 : 100}ms,color 200ms`,
    opacity: loading ? 0 : 1,
  };

  return (
    <div style={style} />
  )
}

export {
  Navbar,
  Link
};