const { Component } = React;
const { render } = ReactDOM;

class App extends Component {
  state = {
    exampleText: 'This is really long text',
    width: 100
  };

  render() {
    const styles = {
      exampleText: {
        width: 200
      },
      range: {
        marginLeft: 25,
        width: 275
      },
      svg: {
        height: 125,
        display: 'block',
        border: '1px solid #aaa',
        marginBottom: 10,
      }
    }
    
    return (
      <div>
        <div>
          <input type="text" style={styles.exampleText}
            value={this.state.exampleText} 
            onChange={e => this.setState({exampleText: e.target.value})} />
          
          <div>Width: {this.state.width}</div>

          <input type="range" style={styles.range}
            min="25" max="300"
            value={this.state.width}
            onChange={e => this.setState({width: e.target.value})} />
        </div>
        
        <h2>Simple</h2>
        <svg width={this.state.width} style={styles.svg}>
          <Text x="0" y="0.71em" width={this.state.width}>
            {this.state.exampleText}
          </Text>
        </svg>
        
        <h2>Centered</h2>
        <svg width={this.state.width} style={styles.svg}>
          <Text x={this.state.width/2} y="0.71em" width={this.state.width} textAnchor="middle">
            {this.state.exampleText}
          </Text>
        </svg>
        
        <h2>Line height</h2>
        <svg width={this.state.width} style={styles.svg}>
          <Text x="0" y="0.71em" width={this.state.width} lineHeight="2">
            {this.state.exampleText}
          </Text>
        </svg>
        
        <h2>Styled text (fontWeight)</h2>
        <svg width={this.state.width} style={styles.svg}>
          <Text x="0" y="0.71em" width={this.state.width} style={{fontWeight: 900}}>
            {this.state.exampleText}
          </Text>
        </svg>
        
        <h2>Styled (fontSize px)</h2>
        <svg width={this.state.width} style={styles.svg}>
          <Text x="0" y="0.71em" width={this.state.width} style={{fontSize: '24px'}}>
            {this.state.exampleText}
          </Text>
        </svg>
        
        <h2>Styled (fontSize em)</h2>
        <svg width={this.state.width} style={styles.svg}>
          <Text x="0" y="0.71em" width={this.state.width} style={{fontSize: '1.5em'}}>
            {this.state.exampleText}
          </Text>
        </svg>

        <h2>Styled (fontSize rem)</h2>
        <svg width={this.state.width} style={styles.svg}>
          <Text x="0" y="0.71em" width={this.state.width} style={{fontSize: '1.5rem'}}>
            {this.state.exampleText}
          </Text>
        </svg>
        
        <h2>Styled (fontSize %)</h2>
        <svg width={this.state.width} style={styles.svg}>
          <Text x="0" y="0.71em" width={this.state.width} style={{fontSize: '150%'}}>
            {this.state.exampleText}
          </Text>
        </svg>
        
      </div>
    )
  }
}

class Text extends Component {

  static defaultProps = {
    lineHeight: 1,
    capHeight: 0.71,
  };
  
  constructor(props) {
    super(props);
    
    this.state = {
      lines: []
    }
  }
  
  componentWillMount() {
    const { wordsWithComputedWidth, spaceWidth } = this.calculateWordWidths();
    this.wordsWithComputedWidth = wordsWithComputedWidth;
    this.spaceWidth = spaceWidth;
    
    const lines = this.calculateLines(this.wordsWithComputedWidth, this.spaceWidth, this.props.width);
    this.setState({ lines });
  }
  
  render() {
    // TODO: determine lineHeight and dy dynamically (using passed in props)
    const { lineHeight, capHeight, ...props } = this.props;
    const dy = capHeight;
    const { x, y } = props;
    
    return (
      <text {...props} dy={`${dy}em`}>
        {this.state.lines.map((word, index) => (
          <tspan x={x} y={y} dy={`${index * lineHeight}em`}>
            {word}
          </tspan>
        ))}
      </text>
    )
  }
  
  componentDidUpdate(nextProps, nextState) {
    if (this.props.children != nextProps.children) {
      const { wordsWithComputedWidth, spaceWidth } = this.calculateWordWidths();
      this.wordsWithComputedWidth = wordsWithComputedWidth;
      this.spaceWidth = spaceWidth; 
    }
    
    const lines = this.calculateLines(this.wordsWithComputedWidth, this.spaceWidth, this.props.width);
    const newLineAdded = this.state.lines.length !== lines.length;
    const wordMoved = this.state.lines.some((line, index) => line.length != lines[index].length);
    // Only update if number of lines or length of any lines change
    if (newLineAdded || wordMoved) {
      this.setState({ lines }) 
    }
  }
  
  calculateWordWidths() {
    // Calculate length of each word to be used to determine number of words per line
    const words = this.props.children.split(/\s+/);
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    Object.assign(text.style, this.props.style);
    svg.appendChild(text);
    document.body.appendChild(svg);
    
    const wordsWithComputedWidth = words.map(word => {
      text.textContent = word;
      return { word, width: text.getComputedTextLength() }
    })

    text.textContent = '\u00A0'; // Unicode space
    const spaceWidth = text.getComputedTextLength();

    document.body.removeChild(svg);
    
    return { wordsWithComputedWidth, spaceWidth }
  }
  
  calculateLines(wordsWithComputedWidth, spaceWidth, lineWidth) {
    const wordsByLines = wordsWithComputedWidth.reduce((result, { word, width}) => {
      const lastLine = result[result.length - 1] || { words: [], width: 0 };
      
      if (lastLine.words.length === 0) {
        // First word on line
        const newLine = { words: [word], width };
        result.push(newLine);
      } else if (lastLine.width + width + (lastLine.words.length * spaceWidth) < lineWidth) {
        // Word can be added to an existing line
        lastLine.words.push(word);
        lastLine.width += width;
      } else {
        // Word too long to fit on existing line
        const newLine = { words: [word], width };
        result.push(newLine);
      }
      
      return result;
    }, []);
   
    return wordsByLines.map(line => line.words.join(' '));
  }
}

render(<App />, document.getElementById('root'));