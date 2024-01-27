# Quantum field theories

## Overview

We seek the static and dynamic properties of quantum field theories, specifically gauge field theories and scalar field theories. Gauge field theories describe the interactions between matter and/or gauge degrees of freedom, and can be classified by their symmetry groups, such as U$(1)$ (describing quantum electrodynamics), SU$(2)$ (the weak interaction), and SU$(3)$ (quantum chromodynamics). Scalar field theories describe interactions between scalar fields, such as the Higgs field or $\phi^4$ theory.


Interacting quantum field theories are typically not analytically solvable, and techniques such as perturbation theory are only accurate in some parameter regimes. For example, low energies of quantum chromodynamics (QCD), which is the regime of quark confinement and hadron formation, cannot be treated perturbatively. As such, complex scattering processes at particle accelerators are currently treated with a combination of first-principles calculations and approximate phenomenological methods.


To tackle quantum field theories numerically from first principles, lattice field theory is employed. However, lattice field theory is computationally expensive on classical devices (either due to the size of the Hilbert space in Hamiltonian formulations, or due to the sign-problem present in Lagrangian formulations tackled via Monte Carlo methods). As such, there have been a number of proposals to use quantum computers for calculating the static and dynamic properties of lattice field theories. For further background see [@preskill2018SimQFT; @davoudi2022quantumHEP; @meurice2022TensorLatticeFieldTheory] and references therein.


## Actual end-to-end problem(s) solved

We focus on the case of lattice gauge field theories in the Hamiltonian formulation, which explicitly separates temporal and spatial degrees of freedom [@kogut1979LatticeGaugeTheory]. We discretize $d$-dimensional space using an $L^d$ lattice (noncubic lattices can also be used). Matter degrees of freedom (e.g. fermions, quarks) are placed on the vertices of the lattice. Gauge degrees of freedom (e.g. the value of the electromagnetic field) are placed on the links between lattice sites. Dynamical simulations proceed by initializing the system in a desired state [@bagherimehrab2022InitialStatePrepQFT], performing time evolution under the Hamiltonian, and measuring relevant observables. Static simulations aim to prepare a state of interest, such as the ground state of a collection of quarks representing a composite hadron, the binding energy of which can then be measured.


The measured observable values may be incorporated as part of a larger computation; for example, accurate scattering matrix elements may be used in a phenomenological model of complex scattering processes studied at particle accelerators [@gehrmann2022QCDatLHCapprox].


## Dominant resource cost/complexity

We will focus predominantly on the simulation of dynamics, as the majority of studies to date have considered this application. We have $N=L^d$ lattice sites. In the standard formulation, we allocate one qubit per fermion (or antifermion) type per lattice site. Each gauge degree of freedom (one in U$(1)$, three in SU$(2)$, eight in SU$(3)$) requires its own register associated with each edge between lattice sites. The values of the gauge degrees of freedom are encoded in binary, up to a maximum cutoff value $\Lambda$, so the corresponding register requires $\log(\Lambda)$ qubits. It was shown in [@tong2021ProvablyAccurateGaugeTheoryBosonicSystems] that for time evolution performed with fixed lattice spacing, the cutoff can be set as $\Lambda = \Lambda_0 + \widetilde{\mathcal{O}}\left( T \mathrm{polylog}(N/\epsilon) \right)$, where $\Lambda_0$ is the maximum initial value of the gauge fields, $T$ is the time evolution duration, and $\epsilon$ is the resulting error in the final state. Hence, the overall number of qubits required to store the state of the system scales as $$\begin{equation} \mathcal{O}\left( L^d \log\left( \Lambda_0 + T \mathrm{polylog}\left(\frac{L^d}{\epsilon} \right) \right) \right). \end{equation}$$


Algorithms for implementing time evolution under lattice gauge field theory Hamiltonians are presented in [@tong2021ProvablyAccurateGaugeTheoryBosonicSystems; @shaw2020QuantumAlgorithmsSchwinger; @kan2021lattice; @Rajput2022HybridizedMF]. It is necessary to maintain gauge-invariance during the simulation, which can be achieved either by the choice of formulation, or by actively protecting symmetries. As an example of the former option, one can calculate the desired Hamiltonian matrix elements on the fly using Clebsch–Gordon coefficients [@byrnes2006LatticeGaugeTheory], but this is expensive in terms of elementary quantum operations [@kan2021lattice]. The algorithm of [@kan2021lattice] yielded an asymptotic complexity of approximately $$\begin{equation} \label{Eq:LGTscaling} \widetilde{\mathcal{O}}\left( \frac{(T L^3)^{3/2} \Lambda}{\epsilon^{1/2}} \right) \end{equation}$$ for performing time evolution for time $T$ to accuracy $\epsilon$.


## Existing error corrected resource estimates

The number of T gates required to simulate instances of the lattice Schwinger model (U$(1)$ lattice gauge field theory in $d=1$ with both matter and gauge degrees of freedom) was studied in [@shaw2020QuantumAlgorithmsSchwinger]. That work considered the resources required to perform [Trotterized time evolution](../../quantum-algorithmic-primitives/hamiltonian-simulation/introduction.md#hamiltonian-simulation) and estimate the electron-positron pair density. The most complex simulations analyzed (64 lattice sites, cutoff of $\Lambda=8$) required $5 \times 10^{13}$ $T$ gates per shot, and $333$ logical qubits. Such a circuit would need to be repeated $\mathcal{O}\left( 1/\epsilon^2 \right)$ times to estimate the pair density to accuracy $\epsilon$. Note that a simulation of the 64-site lattice Schwinger model with $\Lambda=8$ is well within the range of classical simulations [@felser2020TensorNetworkLGT2D; @magnifico2021TensorNetworkLGT3D].


Ref. [@kan2021lattice] performed similar resource estimates for the simulation of dynamical quantities in U$(1)$, SU$(2)$, and SU$(3)$ lattice gauge field theory for $d=3$. We present a selection of the resource estimates in Table [1](#tab:QFTestimates){reference-type="ref" reference="tab:QFTestimates"}. There are large logarithmic and constant factors hidden by the big-$\mathcal{O}\left( \cdot \right)$ scaling in Eq. $\eqref{Eq:LGTscaling}$; for simulating heavy ion collisions, the asymptotic expression yields estimates of $10^{15.5}$ gates, considerably smaller than the SU$(3)$ estimate in Table [1](#tab:QFTestimates){reference-type="ref" reference="tab:QFTestimates"}. The large constant factors present in these resource estimates stem from the use of quantum arithmetic (for example, constituting 99.998% of the gate count in the hadronic tensor calculation [@kan2021lattice]), which is particularly prevalent in the SU$(2)$ and SU$(3)$ simulations. Nevertheless, any implementation scaling as $\Omega(TL^3 \Lambda)$ already pays a factor of $10^{10}$ for $T=L=\Lambda=100$, highlighting the potentially large resource counts of simulating quantum field theories. In addition, these resource estimates only consider the cost of time evolution, not the additional overheads of initial state preparation and observable estimation.


<figure markdown> <span id="tab:QFTestimates"></span>


|                                 **Simulation**                                  |                                **Parameters**                                |                            **QFT**                             |              **#Logical qubits**              |                  **#$T$ gates**                   |
| :-----------------------------------------------------------------------------: | :--------------------------------------------------------------------------: | :------------------------------------------------------------: | :-------------------------------------------: | :-----------------------------------------------: |
| Computing transport coefficients (relevant to the study of quark-gluon plasmas) |   $\begin{gathered}L=10, T=1\\ \Lambda=10, \epsilon=10^{-8}\end{gathered}$   | $\begin{gathered}\mathrm{U}(1)\\\mathrm{SU}(3)\end{gathered}$  |  $\begin{gathered}10^4\\10^5\end{gathered}$   | $\begin{gathered}10^{17}\\10^{49}\end{gathered}$  |
|                       Simulation of heavy ion collisions                        |  $\begin{gathered}L=100, T=10\\ \Lambda=10, \epsilon=10^{-8}\end{gathered}$  | $\begin{gathered}\mathrm{U}(1)\\ \mathrm{SU}(3)\end{gathered}$ | $\begin{gathered}10^7\\ 10^{8}\end{gathered}$ | $\begin{gathered}10^{23}\\ 10^{55}\end{gathered}$ |
|                     Computing hadronic tensor of the proton                     | $\begin{gathered}L=20, T=8000\\ \Lambda=10, \epsilon=10^{-8} \end{gathered}$ |                        $\mathrm{SU}(3)$                        |                    $10^6$                     |                     $10^{56}$                     |


<figcaption markdown>Table 1: Resource estimates from [@kan2021lattice] for simulation of a range of problems. The estimates consider time evolution for time $T$ of an $L \times L \times L$ lattice, using a cutoff of $\Lambda$ for the gauge fields. The precision in the evolution is bounded by $\epsilon$. </figcaption> </figure>


## Caveats

Discretization of the continuous field theory to the lattice setting introduces a number of nuances that are also present in classical approaches, but must be considered afresh in quantum calculations. As discussed in [@mathis2020SimulationLatticeGauge], discretization of the fermion field breaks the Lorentz invariance of the fermion kinetic term, which introduces unphysical additional flavors of fermions (known as the fermion doubling problem). This issue can be mitigated in several established ways, each with their own merits and drawbacks for quantum simulation. It is also necessary to carefully track other errors resulting from discretization and ensure that these vanish when scaling and extrapolating to the continuum limit [@jordan2012QuantumFieldTheory].


As noted in [@davoudi2022quantumHEP Sec. 6b] and [@ciavarella2021TrailheadLatticeGaugeTheory], there are a number of possible bases that can be used for the gauge degrees of freedom, and it is currently unclear which choice is optimal for quantum simulation.


## Comparable classical complexity and challenging instance sizes

The end-to-end scattering processes typically considered at particle accelerators are too complex to be solved from first principles and are tackled using a range of approximate techniques [@gehrmann2022QCDatLHCapprox]. These calculations often include parameters obtained from first-principles lattice gauge theory calculations on simpler systems, and they typically proceed through a Lagrangian formulation, rather than a Hamiltonian formulation. This leads to Monte Carlo sampling of a path integral in Euclidean spacetime, the application of which to dynamical problems or static problems with high fermion density is limited by the fermionic sign problem. For example, it is challenging to compute parton distribution functions with classical methods [@davoudi2022quantumHEP]. Nevertheless, classical approaches have been very effective for static problems with lower fermion density; for a review of current state-of-the-art calculations and limitations see [@joo2019LatticeQCDReview] and its companion whitepapers referenced therein.


Recent work has investigated the Hamiltonian formulation of lattice gauge theories (LGTs) using tensor network methods; see, for example, [@felser2020TensorNetworkLGT2D] ($d=2, L=16$, U$(1)$ LGT with gauge field cutoff $\Lambda=1$) and [@magnifico2021TensorNetworkLGT3D] ($d=3, L=8$, U$(1)$ LGT with gauge field cutoff $\Lambda=1$). Like quantum simulations, tensor network approaches are sign-problem free and so may be of interest in regimes out of reach of conventional Monte Carlo–based approaches.


## Speedup

For simulations with a sign problem, classical Monte Carlo methods are exponentially costly in system size. In addition, it was observed that the bond dimensions required for tensor network approaches increase rapidly with system size [@magnifico2021TensorNetworkLGT3D], suggesting the potential for exponential quantum speedups for dynamical problems. This suggestion is reinforced by the BQP-completeness of the simulation of certain field theoretic processes [@jordan2018bqpcompletenessofQFT]. Nevertheless, the constant factors for quantum simulations of LGTs are currently high, and we require the ability to efficiently prepare initial states of interest.


## NISQ implementation

There has been significant research on implementing simplified models of LGTs using analog quantum simulators such as cold atoms or trapped ions; see for example [@georgescu2014qSim; @davoudi2022quantumHEP] and references therein. There have also been works applying [variational algorithms](../../quantum-algorithmic-primitives/variational-quantum-algorithms.md#variational-quantum-algorithms) to LGTs, such as [@kokail2019VariationalLatticeSchwinger; @atas2021VariationalSU2; @liu2022VariationalFieldTheorySim].


## Outlook

Investigations into how quantum computers can be used to complement classical methods for simulating lattice field theories are still in their initial stages. While quantum computers can, in principle, efficiently simulate the complex scattering experiments performed in particle accelerators, the resources required to do so would be astronomical using currently known techniques. Future work must determine the best targets for quantum simulations, and work to reduce asymptotic scaling factors and constant prefactors. In particular, the qubit encoding (currently scaling as $\mathcal{O}\left( L^d \right)$ qubits for a lattice in $d$ spatial dimensions with each dimension having $L$ sites) means that a large number of logical qubits will likely be required for calculations of interest where, as illustrated by examples above, we may consider $L = 10$–$100$ to challenge classical approaches. 





