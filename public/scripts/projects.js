var Router = ReactRouter.Router;
var Link = ReactRouter.Link;

// Container for /projects view and functionality
window.ProjectBox = React.createClass({
  loadProjectsFromServer: function() {
    $.ajax({
      url: 'api/projects',
      dataType: 'text',
      cache: false,
      type: 'GET', 
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('api/projects', status, err.toString());
      }.bind(this)
    });
  },

  // When user adds a new project, the state is updated to add the new project to the list, and it's 
  // added to the database via Post request.
  handleProjectSubmit: function(project) {
    var projects = this.state.data;
    var newProjects = projects.concat([project]);
    this.setState({data: newProjects});
    $.ajax({
      url: 'api/projects',
      contentType: 'application/json',
      type: 'POST',
      data: project,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: projects});
        console.error('api/projects', status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    // sets this.state.data to blank
    console.log(window);
    return {projectId: 0, data: [{title: 'someProject1', _id: 13123125}, {title: 'someProject2', _id: 131232123}, {title: 'someProject3', _id: 131231253}]};
  },

  componentDidMount: function() {
    //initiates get request to set this.state.data to whatever is stored in the database

    //this.loadProjectsFromServer();
    //setInterval(this.loadProjectsFromServer, this.props.pollInterval);
  },

  render: function() {
    //by having onCommentSubmit={this.handleProjectSubmit} in the ProjectForm tag, we are able to pass
    //ProjectBox's handleProjectSubmit method to ProjectForm on the this.props object. ProjectBox
    //i.e. this.props.handleProjectSubmit
    return (
      <div className="projectBox">
        <h1>Projects</h1>
        <ProjectForm onProjectSubmit={this.handleProjectSubmit} />
        <ProjectList data={this.state.data} />
      </div>
    );
  }
});

window.ProjectForm = React.createClass({
  getInitialState: function() {
    return {title: ''};
  },
  handleProjectChange: function(e) {
    this.setState({title: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var project = this.state.title.trim();
    if (!project) {
      return;
    }
    this.props.onProjectSubmit({title: project});
    this.setState({title: ''});
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="project"
          placeholder="Say something..."
          value={this.state.title}
          onChange={this.handleProjectChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

window.ProjectList = React.createClass({
  render: function() {

    // render returns an array of Project components by mapping the project objects
    // stored in this.props.data
    var projectNodes = this.props.data.map(function(project) {
      return (
        <Project project={project} key={project._id}>
          {project.title}
        </Project>
      );
    });
    return (
      <div className="projectList">
        {projectNodes}
      </div>
    );
  }
});

window.Project = React.createClass({
  render: function() {
    //returns a div that when clicked on will navigate to the links page for that specific project.
    //this.props.project is passed in from ProjectList by saying project={project} where {project}
    //refers to an individual project passed as a parameter to the map function
    //i.e. {project} = {title: "My Project", id: 1234}
    return (
      <div className="project">
        <Link to={`/links/${this.props.project._id}`}>{this.props.project.title}</Link>
      </div>
    );
  }
});