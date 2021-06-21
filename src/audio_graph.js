'use strict';

const e = React.createElement;

class AudioNodeComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return e(
            'div',
            {className: "audio-node"},
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
        this.props.nodes.map((n) => e(AudioNodeComponent, {key: n.key, name: n.name}))
    );
  }
}

export {AudioGraph}