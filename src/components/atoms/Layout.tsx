/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useIsolatedStore } from "react-stores";

interface IProps {
  name: string;
}

export const Layout: React.FC<IProps> = ({ name, children }) => {
  const storeUI = useIsolatedStore(
    {
      horizontal: "30%"
    },
    {
      name,
      persistence: true
    }
  );

  const [horizontalDrag, setHorizontalDrag] = React.useState(false);

  const thirdRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleMove = function(event) {
      if (thirdRef.current) {
        thirdRef.current.style.width =
          document.body.clientWidth - event.pageX + "px";
      }
    };

    const handleMouseUp = function(event) {
      storeUI.setState({
        horizontal: document.body.clientWidth - event.pageX + "px"
      });
      setHorizontalDrag(false);
    };

    if (horizontalDrag) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [horizontalDrag]);

  return (
    <div css={[root, horizontalDrag && dragOn]}>
      <div>{children[0]}</div>

      <div>
        {children[1]}
        <div
          css={dropZone}
          onDragStart={event => event.preventDefault()}
          onMouseDown={() => {
            setHorizontalDrag(true);
          }}
        />
      </div>
      <div ref={thirdRef} style={{ width: storeUI.state.horizontal }}>
        {children[2]}
      </div>
    </div>
  );
};

const root = css`
  display: flex;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: stretch;

  > *:nth-of-type(1) {
    flex: 0 0 180px;
    position: relative;
    overflow: auto;
  }

  > *:nth-of-type(2) {
    flex: 1 10 auto;
    min-width: 100px;
    border-left: var(--border);
    overflow: auto;
    position: relative;
  }

  > *:nth-of-type(3) {
    flex: 0 1 auto;
    min-width: 100px;
    border-left: var(--border);
    overflow: auto;
  }
`;

const dragOn = css`
  cursor: ew-resize;
`;

const dropZone = css`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 10px;
  cursor: ew-resize;
  user-select: none;
  z-index: 100000;
`;
