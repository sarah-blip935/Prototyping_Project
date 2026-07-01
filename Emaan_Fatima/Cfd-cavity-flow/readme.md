# CFD Lid-Driven Cavity Flow

## Project Overview

This project contains a Python-based CFD (Computational Fluid Dynamics) simulation of the classic Lid-Driven Cavity Flow problem, solved using the finite difference method for the 2D incompressible Navier-Stokes equations. It serves as a lightweight, browser-based alternative to commercial CFD software such as Star-CCM+.

## Files Included

- `cfd_cavity_flow.py` - Python source code for the CFD simulation
- `cfd_result.png` - Output plot showing velocity magnitude, streamlines, and pressure field
- `readme.md` - Project documentation

## How It Works

The simulation solves the 2D incompressible Navier-Stokes equations using a finite difference projection method:

1. A square domain is discretized into a grid.
2. The top wall (lid) moves with a constant velocity, driving a circulating flow inside the cavity.
3. Velocity and pressure fields are iteratively updated at each time step using the momentum equations and a pressure Poisson solver.
4. No-slip boundary conditions are applied on all stationary walls.
5. Final results are visualized as velocity magnitude with streamlines, and a pressure contour plot.

## Parameters (Adjustable)

- `lid_velocity` - Speed of the moving lid
- `nu` - Kinematic viscosity of the fluid
- `nx, ny` - Grid resolution
- `nt` - Number of simulation time steps

## Tools Used

- Python (NumPy, Matplotlib)
- Google Colab

## Author

Eman Fatima — CFD Lid-Driven Cavity Flow Project - Python Simulation
