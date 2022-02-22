import { Component } from 'react';

// Error Boundary is special cmponent which catches the error
// thrown by it's child components. For now, Can only be done
// using class-based component, since it has componentDidCatch
// live cycle method

class ErrorBoundary extends Component {
  constructor() {
    super();
    this.state = { hasError: false };
  }

  componentDidCatch(error) {
    console.log(error);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong!</p>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;


// ----- Child that throw error ----- 

// componentDidUpdate() {
//   // try - catch only catches error in same component
//   // try {
//   //   someCodeWhichMightFail()
//   // } catch (err) {
//   //   // handle error
//   // }

//   if (this.props.users.length === 0) {
//     throw new Error('No users provided!');
//   }
// }


// ----- Parent that implements Error Boundary ----- 

// <ErrorBoundary>
//  {/* can have multiple child components */}
//  <Users users={this.state.filteredUsers} />
// </ErrorBoundary>