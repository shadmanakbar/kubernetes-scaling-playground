# Kubernetes Scaling Playground Simulator

## Description
The Kubernetes Scaling Playground Simulator is an interactive web application designed to help users understand and experiment with Kubernetes scaling concepts. This educational tool provides a visual and hands-on approach to learning how Kubernetes handles pod scaling, resource allocation, and load balancing in a safe, simulated environment.

## Objective
- Provide a realistic simulation of Kubernetes scaling behaviors
- Help users understand horizontal and vertical pod scaling
- Visualize pod distribution and resource utilization
- Demonstrate the effects of different scaling policies
- Offer a risk-free environment for experimenting with Kubernetes configurations

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser
- Basic understanding of Kubernetes concepts

### Backend Setup
1. Clone the repository
- git clone [https://github.com/shadmanakbar/kubernetes-scaling-playground.git]
- cd kubernetes-scaling-playground

2. Install backend dependencies
- cd backend
- npm install

3. Start the backend server
- npm start

- The backend server will start on `http://localhost:5000`

### Frontend Setup
1. Navigate to the frontend directory

- cd frontend

2. Install frontend dependencies
- npm install

3. Start the frontend application
- npm start

- The application will be available at `http://localhost:3000`

## Configuration Panel Options

### Pod Configuration
- **Initial Pod Count**: Set the starting number of pods
- **Pod Resources**:
  - CPU Request/Limit
  - Memory Request/Limit
  - Configure resource constraints for each pod

### Scaling Configuration
- **Horizontal Pod Autoscaling (HPA)**:
  - Min/Max Replicas
  - Target CPU Utilization
  - Target Memory Utilization
- **Vertical Pod Autoscaling (VPA)**:
  - Resource Adjustment Thresholds
  - Update Mode (Off, Initial, Auto)

### Load Simulation
- **Traffic Pattern**:
  - Constant Load
  - Gradual Increase
  - Spike Pattern
  - Custom Pattern Builder
- **Request Rate**: Adjust incoming request frequency
- **Request Resource Intensity**: Configure CPU/Memory load per request

### Cluster Settings
- **Node Configuration**:
  - Number of Nodes
  - Node Resources (CPU/Memory)
- **Scheduling Policies**:
  - Pod Distribution Strategy
  - Resource Allocation Priority

## Features
- Real-time visualization of pod scaling
- Interactive load generation tools
- Resource utilization monitoring
- Scaling metrics dashboard
- Configuration export/import
- Scenario saving and replay
- Step-by-step scaling tutorials
- Mobile-responsive design

## Simulation Metrics
- Pod count and distribution
- Resource utilization per pod
- Scaling events timeline
- Request success/failure rates
- Node capacity utilization
- Scaling decision logs

## Use Cases
1. **Educational**:
   - Learning Kubernetes scaling concepts
   - Understanding resource management
   - Experimenting with different configurations

2. **Development**:
   - Testing scaling policies
   - Validating resource configurations
   - Debugging scaling issues

3. **Planning**:
   - Capacity planning
   - Performance testing
   - Configuration optimization

## Technical Architecture
- Frontend: React.js with TypeScript
- Backend: Node.js
- Visualization: D3.js/Chart.js
- State Management: Redux
- WebSocket for real-time updates

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Known Limitations
- Simulation may not perfectly match real Kubernetes behavior
- Some advanced Kubernetes features not implemented
- Resource metrics are approximated

## Future Enhancements
- Additional scaling policies
- More complex networking scenarios
- Custom metric-based scaling
- Multi-cluster simulation
- Advanced scheduling algorithms

## Support
For issues, questions, or contributions, please:
1. Check existing issues in the repository
2. Create a new issue with detailed information
3. Join our community discussion forum

