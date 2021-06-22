'use strict';

const e = React.createElement;

class AudioNodeComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return e(
            'div',
            {
              className: "audio-node",
              onClick: this.props.onClick
            },
            this.props.name
        );
    }
}

class AudioGraph extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(
        'div', 
        null,
        this.props.audioManager.intermediateNodes.map((n, i) => e(AudioNodeComponent, {
          key: i, 
          name: n.constructor.name, 
          onClick: () => {
            console.log(`${n.constructor.name} clicked`);
            this.props.audioManager.removeNode(i);
          }
        }))
    );
  }
}

export {AudioGraph}