import React from 'react';
import dark from './images/icon-sun.svg';
import light from './images/icon-moon.svg';



class Toggle extends React.Component {
  constructor(props){
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(){
    this.props.onToggle();
  }

  render(){
    return(
      <div className='theme'>
        <h1 className=''>TODO</h1>
        <div>
          <input type={'checkbox'} id='toggle-theme' 
                onClick={this.handleToggle}>   
          </input>
          <label htmlFor='toggle-theme' className='toggle' style={{backgroundImage: "url(" + this.props.theme + ")"}}></label>
        </div>
  
      </div>
    );
  }
}

class CreateTodo extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.entryFunction = this.entryFunction.bind(this);
  }

  handleChange(e){
    this.props.onChange(e.target.value);
  }

  entryFunction(event){
    if (event.keyCode === 13){
      this.props.onSubmit();
    };
  }

  componentDidMount(){
    document.addEventListener("keydown", this.entryFunction, false);
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.entryFunction, false);
  }
  
  render(){
  return(
    <div className={this.props.theme===dark?"task-container bgDark":"task-container bgLight"}>
      <label className={this.props.theme===dark?"round border-dark":"round border-light"}></label>
      <input className={this.props.theme===dark?"text-dark":"text-light"} type={'text'} placeholder={'Create a new todo ...'} value={this.props.newText} onChange={this.handleChange}></input>
    </div>
  )
  }
}

class Task extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleClick(){
    this.props.onClick();
  }

  handleDelete(){
    this.props.onDelete();
  }

  render() {
    var completed = this.props.completed;
    var theme = this.props.theme;

    function themeCheck(){
      if(completed && theme===dark){
        return "complete border-dark";
      }else if(completed && theme===light){
        return "complete border-light";
      }else if(!completed && theme===dark){
        return "round border-dark";
      }else if(!completed && theme===light){
        return "round border-light";
      }
    }

    function themeStyle(){
      if(completed && theme===light){
        return {textDecoration: 'line-through', textDecorationColor: 'hsl(234, 39%, 85%)', color: 'hsl(233, 11%, 84%)'};
      }else if(completed && theme===dark){
        return {textDecoration: 'line-through', textDecorationColor: 'hsl(234, 39%, 85%)', color: 'hsla(234, 39%, 85%, 0.3)'};
      }else {
        return {}
      }
    }

    
    return(
      <>
        <button onClick={this.handleClick}>
        <input type={'checkbox'} id='checkTodo' onClick={this.handleClick}></input>
          <label htmlFor='checkTodo' 
            className={themeCheck()}>
            <div className={this.props.theme===dark?"roundHover bgDark":"roundHover bgLight"}></div></label>
          <p className={this.props.theme===dark?"todo-text text-dark":"todo-text text-light"} 
            style={themeStyle()}>
            {this.props.text}</p>
        </button>
        
        <button className='cross' onClick={this.handleDelete}></button>
      </>
    )
  }
} 


class Navbar extends React.Component {
  constructor(props){
    super(props);
    this.handleSelection = this.handleSelection.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleClear(){
    this.props.onClear();
  }

  handleSelection(e){
    this.props.onSelection(e.target.value);
  }

  render(){ 
    return(
      <div className={this.props.theme===dark?"navbar bgDark-D":"navbar bgLight-D"}>
        <p className={this.props.theme===dark?"items-left bgDark text-dark2":"items-left bgLight text-light2"}>1 items left</p>
        <button className={this.props.theme===dark?"clear bgDark text-dark2":"clear bgLight text-light2"} type='button' onClick={this.handleClear}>Clear Completed</button>
        <ul className={this.props.theme===dark?"task-container bgDark text-dark2":"task-container bgLight text-light2"}>
          <li className={this.props.selection===1?'selected':''}
              onClick={(e) => this.handleSelection(e)}
              value={1}>
            All
          </li>
          <li className={this.props.selection===2?'selected':''}
              onClick={(e) => this.handleSelection(e)}
              value={2}>
            Active
          </li>
          <li className={this.props.selection===3?'selected':''}
              onClick={(e) => this.handleSelection(e)}
              value={3}>
            Completed
          </li>
        </ul>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      taskArray :[],
      newText: '',
      selection: 1,
      dragItem: null,
      dragOverItem: null,
      theme: dark,
    };

    this.handleNewTextChange = this.handleNewTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleClick = this.handleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.handleSelection = this.handleSelection.bind(this);
    this.handleClear = this.handleClear.bind(this);

    this.dragEnter = this.dragEnter.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.handleDrop = this.handleDrop.bind(this);

    this.handleTheme = this.handleTheme.bind(this);
  };

  handleClick(index){
    var current = this.state.taskArray.slice();
    current.forEach((todo) => {
      if(todo.id === index){
        todo.completed = !todo.completed;
      } else {
        return;
      }
    })

    this.setState({
      taskArray: current
    })
  }

  handleDelete(index){
    var current = this.state.taskArray.slice();
    var newArr = [];
    current.forEach((todo) => {
      if(todo.id !== index){
        newArr.push(todo);
      } else {
        return;
      }
    })

    this.setState({
      taskArray: newArr,
    })
  }

  handleNewTextChange(text){
    this.setState({
      newText: text,
    });
  }

  handleSubmit(){
    var aléat = Math.random();
    var todo = {"id": aléat,"text" : this.state.newText, "completed" : false};
    var current = this.state.taskArray;

    current.push(todo);

    this.setState({
      taskArray: current,
      newText: '',
    });
  }

  handleSelection(number){
    this.setState({
      selection: number,
    });
  }

  handleClear(){
    var current = this.state.taskArray.slice();
    var newArr = [];

    current.forEach((todo) => {
      if(todo.completed === false){
        newArr.push(todo);
      }
    })

    this.setState({
      taskArray : newArr,
    })
  }

  dragStart(e, position){
    this.setState({
      dragItem: position,
    })
  }

  dragEnter(e, position){
    this.setState({
      dragOverItem: position,
    })
  }

  handleDrop(e){
    const copyListItems = [...this.state.taskArray];
    var dragItem = this.state.dragItem;
    var dragOverItem = this.state.dragOverItem;
    const dragItemContent = copyListItems[dragItem];

    copyListItems.splice(dragItem, 1);
    copyListItems.splice(dragOverItem, 0, dragItemContent);

    this.setState({
      taskArray: copyListItems,
      dragItem: null,
      dragOverItem: null,
    })
  }

  handleTheme(){
    var themeC = this.state.theme;
    if(themeC === dark){
      themeC = light;
    } else {
      themeC = dark;
    }
    this.setState({
      theme: themeC
    })
  }

  render(){
    var current = this.state.taskArray.slice();
    var textArr = [];
    var completeArr = [];

    current.forEach((value) =>{
      textArr.push(value.text);
      completeArr.push(value.completed);
    })

    var rendTodo = textArr.map((task, index) => {
      if(this.state.selection === 1){
        return(
          <div 
            key={index} 
            className={this.state.theme===dark?"task-container bgDark":"task-container bgLight"}
            onDragStart={(e) => this.dragStart(e, index)}
            onDragEnter={(e) => this.dragEnter(e, index)}
            onDragEnd={(e) => this.handleDrop(e)}
            draggable>
            <Task text={task} completed={completeArr[index]} id={index} theme={this.state.theme}
                  onClick={() => this.handleClick(current[index].id)}
                  onDelete={() => this.handleDelete(current[index].id)}
                  />
          </div>
        )
      } else if(this.state.selection === 2 && !completeArr[index]){
        return(
          <div 
            key={index} 
            className={this.state.theme===dark?"task-container bgDark":"task-container bgLight"}
            onDragStart={(e) => this.dragStart(e, index)}
            onDragEnter={(e) => this.dragEnter(e, index)}
            onDragEnd={(e) => this.handleDrop(e)}
            draggable>
            <Task text={task} completed={completeArr[index]} id={index} theme={this.state.theme}
                  onClick={() => this.handleClick(current[index].id)}
                  onDelete={() => this.handleDelete(current[index].id)}
                  />
          </div>
        )
      } else if(this.state.selection === 3 && completeArr[index]){
        return(
          <div 
            key={index} 
            className={this.state.theme===dark?"task-container bgDark":"task-container bgLight"}
            onDragStart={(e) => this.dragStart(e, index)}
            onDragEnter={(e) => this.dragEnter(e, index)}
            onDragEnd={(e) => this.handleDrop(e)}
            draggable>
            <Task text={task} completed={completeArr[index]} id={index} theme={this.state.theme}
                  onClick={() => this.handleClick(current[index].id)}
                  onDelete={() => this.handleDelete(current[index].id)}
                  />
          </div>
        )
      }
      return '';
    })

    return (
      <div className={this.state.theme===dark?"App":"App-light"}>
        <main>
          <Toggle 
            theme={this.state.theme}
            onToggle={this.handleTheme}
          />
          <CreateTodo newText={this.state.newText} 
                      onChange={this.handleNewTextChange} 
                      onSubmit={this.handleSubmit}
                      theme={this.state.theme}
                      />
          <div className='todo'>
            <ol>{rendTodo}</ol>
          </div>
          <Navbar
            theme={this.state.theme}
            onClear={this.handleClear}
            selection={this.state.selection}
            onSelection={this.handleSelection}
          />
          <p className={this.state.theme===dark?"info text-dark2":"info text-light2"}>Drag and drop to reorder list</p>
        </main>
      </div>
    );
  }
}

export default App;
