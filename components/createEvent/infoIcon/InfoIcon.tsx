import { useState, useRef, MouseEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';

export const InfoIcon = () => {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState<HTMLElement | null>(null); // Указываем тип для target
  const ref = useRef<HTMLDivElement>(null); // Указываем тип для ref

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setShow(!show);
    setTarget(event.currentTarget); // event.target может быть не HTMLElement, используем currentTarget
  };

  return (
    <div ref={ref}>
      <Button onClick={handleClick}>!</Button>

      <Overlay
        show={show}
        target={target}
        placement="bottom"
        container={ref.current}
        containerPadding={20}
      >
        <Popover id="popover-contained">
          <Popover.Header as="h3">Инфо title</Popover.Header>
          <Popover.Body>
            <strong>Важное замечание</strong> важный текст
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
};