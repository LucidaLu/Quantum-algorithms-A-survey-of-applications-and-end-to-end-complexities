# Spin models

## Overview

Classical and quantum spin systems are prototypical models for a wide range of physical phenomena including: magnetism, neuron activity, simplified models of materials and molecules, and networks. Studying the properties of spin Hamiltonians can also provide useful insights in quantum information science.


A number of scientific and industrial problems can be mapped onto finding the ground or thermal states of classical or quantum spin models, for example [solving combinatorial optimization problems](../../areas-of-application/combinatorial-optimization/introduction.md#combinatorial-optimization), [training energy-based models in machine learning](../../areas-of-application/machine-learning-with-classical-data/quantum-machine-learning-via-energy-based-models.md#quantum-machine-learning-via-energy-based-models), and simulating low energy models of [quantum chemistry](../../areas-of-application/quantum-chemistry/electronic-structure-problem.md#electronic-structure-problem) [@tazhigulov2022SpinModelsMolecules].


Simulating the dynamics of quantum spin models is primarily of interest for quantum information science, and condensed matter physics or chemistry, for example interpreting nuclear magnetic resonance [@sels2020NMR; @obrien2021NMRsim] or related spectroscopy experiments [@Chiesa2019NeutronScattering; @mcardle2021Muons].


Because of the natural mapping between spin-$1/2$ systems and qubits, as well as the locality of interactions commonly present, the resources required to simulate simple spin models using quantum algorithms can be much lower than for problems in areas like [quantum chemistry](../../areas-of-application/quantum-chemistry/electronic-structure-problem.md#electronic-structure-problem) or [cryptography](../../areas-of-application/cryptanalysis/breaking-cryptosystems.md#breaking-cryptosystems).


While our discussion will focus on quantum algorithms designed to be run on [fault-tolerant quantum computers](../../fault-tolerant-quantum-computation/quantum-error-correction-with-the-surface-code.md#quantum-error-correction-with-the-surface-code), the simple Hamiltonians of spin models are naturally realized in many physical systems. This has led to the use of analog simulators [@bloch2012qSim; @georgescu2014qSim], such as arrays of trapped ions or neutral atoms, for simulating the static and dynamic properties of interesting spin models. We will comment briefly on this below.


## Actual end-to-end problem(s) solved

The most commonly studied spin models are those with pairwise interactions, referred to as $2$-local Hamiltonians. We note that the interactions are not necessarily geometrically local, although this will be present in many models of physical systems. Given a graph $\mathcal{G}$ with $N$ vertices $\{v_i\}$ and $L$ edges $\{E_{ij}\}$ we associate a classical or quantum spin with each vertex, and an interaction between spins with each edge. We can also add one-body interactions acting on individual spins. The Hamiltonian can then be written as $$\begin{equation} \label{Eq:SpinHamiltonian} H = \sum_{v_i\in V} \sum_{\alpha \in \{x,y,z\}} B_i^\alpha \sigma_\alpha^i + \sum_{E_{ij} \in E} \sum_{\alpha, \beta \in \{x,y,z\}} J_{ij}^{\alpha \beta} \sigma_\alpha^i \sigma_\beta^j \end{equation}$$ where $\{\sigma_x^i,\sigma_y^i,\sigma_z^i\}$ denote the Pauli operators $X_i,Y_i,Z_i$ acting on site $i$, and $\{B_i^\alpha\}, \{J_{ij}^{\alpha \beta}\}$ are coefficients. For classical spin Hamiltonians, the sums are restricted to $Z$ operators. The Hamiltonian in Eq. $\eqref{Eq:SpinHamiltonian}$ encompasses a wide range of spin models, including: the classical Ising model $$\begin{equation} H = \sum_i B_i Z_i + \sum_{ij} J_{ij} Z_i Z_j \end{equation}$$ which also describes the Hamiltonians arising from quadratic unconstrained binary optimization (QUBO) problems, the (quantum) transverse field Ising model (TFIM) $$\begin{equation} H = B \sum_i X_i + J \sum_{ij} Z_i Z_j\,, \end{equation}$$ and the Heisenberg model with a site-dependent magnetic field, defined in 1D with nearest-neighbor interactions by $$\begin{equation} H = \sum_j B_j Z_j + J^x X_j X_{j+1} + J^y Y_j Y_{j+1} + J^z Z_j Z_{j+1}. \end{equation}$$ Across the different models, we can vary the dimension, locality of interactions (e.g. nearest-neighbor vs. fully connected vs. power-law), and values of the site-dependent coefficients in comparison to the interaction terms. The models can be extended beyond 2-local by considering couplings of 3 or more spins—see for example $p$-spin models, which are $p$-local [@derrida1980randomEnergyModel]. The above definitions can be extended from spin-$1/2$ systems to higher spin operators by generalizing the Pauli operators with their [higher dimensional counterparts](https://en.wikipedia.org/wiki/Spin_(physics)#Higher_spins).


For classical spin models we seek to prepare the ground or thermal states of the model, as these may encode, for example, the solution to a combinatorial optimization problem, or a probability distribution that can be used for generative modelling. For quantum spin models, we similarly seek to compute ground or thermal states. However, because these are not classical states that can be easily extracted, we typically wish to sample observables with respect to these states. Examples include the energy, the magnetization of the system, or correlations between sites. In dynamical simulations of quantum systems, we seek to determine how observables of interest vary as a function of evolution time. Examples include the magnetization (used to infer the Hamiltonian in NMR [@hogben2011NMRSpinach] or related [@bonfa2021MuonSim] experiments), or the growth of correlations between sites to probe thermalization. [Hamiltonian simulation](../../quantum-algorithmic-primitives/hamiltonian-simulation/introduction.md#hamiltonian-simulation) can efficiently access not only any feature that could be observed for simulated targets (e.g., solid-state materials of interest), but also additional features [@Fraxanet2022decadesQSim] which can lead to deeper understanding of the physics involved. Since studies of quench dynamics often require preparation of simple states (such as product states or the ground states of classically solvable Hamiltonians) and the measurement of local observables, propagation under the Hamiltonian typically dominates the simulation cost. For lattice systems with $N$ spins in $D$ dimensions, it is conventional to consider evolution times that scale as $\Omega\left(N^{1/D}\right)$, as the system must evolve for this long for self-thermalization to take place or even for information to propagate across the system due to the Lieb–Robinson bound [@chen2023speedLimits].


## Dominant resource cost/complexity

For a system of $N$ spin-$1/2$ particles, we require $N$ qubits to represent the state of the system. For $N$ spin-$S$ particles, the problem can be mapped to qubits in different ways, for example using $N \lceil \log_2(2S+1)\rceil$ [@sawaya2020ResourceEfficientQuantumDLevel] qubits or using $2NS$ qubits [@mcardle2021Muons].


Quantum algorithms for preparing the ground or Gibbs states of classical spin systems are discussed in detail in the sections on [combinatorial optimization](../../areas-of-application/combinatorial-optimization/introduction.md#combinatorial-optimization), and [energy-based machine learning models](../../areas-of-application/machine-learning-with-classical-data/quantum-machine-learning-via-energy-based-models.md#quantum-machine-learning-via-energy-based-models), respectively. We will restrict our discussion to the resources required for performing time evolution of quantum spin models. The reason for this is that quantum algorithms for preparing ground or thermal states require similar primitives for Hamiltonian access to algorithms for time evolution (e.g., [block-encodings](../../quantum-algorithmic-primitives/quantum-linear-algebra/block-encodings.md#block-encodings) or [Hamiltonian simulation](../../quantum-algorithmic-primitives/hamiltonian-simulation/introduction.md#hamiltonian-simulation) itself) and use these in conjunction with either: eigenstate filtering approaches [@lin2019OptimalQEigenstateFiltering; @lin2020NearOptimalGroundState] based on [quantum singular value transformation](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-singular-value-transformation.md#quantum-singular-value-transformation), [adiabatic state preparation](../../quantum-algorithmic-primitives/quantum-adiabatic-algorithm.md#quantum-adiabatic-algorithm), [quantum phase estimation](../../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation) from a trial state, or [quantum algorithms for thermal state preparation](../../quantum-algorithmic-primitives/gibbs-sampling.md#gibbs-sampling). More detailed discussions of these algorithms and their caveats can be found on the linked pages, as well as in the discussion of quantum algorithms for simulating [molecules and materials](../../areas-of-application/quantum-chemistry/electronic-structure-problem.md#electronic-structure-problem) or the [Fermi–Hubbard model](../../areas-of-application/condensed-matter-physics/fermi-hubbard-model.md#fermihubbard-model), where preparing (approximate) eigenstates is the primary topic of interest. All of these algorithms depend on either an overlap between the trial state and the target state, the minimum gap along an adiabatic path, or the mixing time of a Markov chain—all of which are difficult to bound in the general case.


When simulating the [time evolution](../../quantum-algorithmic-primitives/hamiltonian-simulation/introduction.md#hamiltonian-simulation) of spin systems, the most efficient algorithms exploit the locality of interactions in the Hamiltonian, and the resulting commutation structure. For $2$-local spin-$1/2$ systems on a $D$-dimensional lattice with nearest-neighbor geometric locality, algorithms with almost optimal gate complexity are known for performing time evolution. Reference [@childs2019NearlyOptimalLattSim] showed that $(2k)$th-order [product formulae](../../quantum-algorithmic-primitives/hamiltonian-simulation/product-formulae.md#product-formulae) scale as $\mathcal{O}\left( (Nt)^{1+1/2k} / \epsilon^{1/2k} \right)$ to simulate time evolution for time $t$ to accuracy $\epsilon$, using a Hamiltonian given in the Pauli access model. Note that this expression suppresses the $5^{2k}$ constant factor present in $(2k)$th-order Trotter. Similarly, [@haah2018QAlgSimLatticeHam] gave an algorithm with complexity $\mathcal{O}\left( Nt \cdot \mathrm{polylog}(Nt/\epsilon) \right)$ for Hamiltonians given in the sparse access model. In contrast, note that approaches that are asymptotically optimal in the black-box setting, such as [quantum signal processing](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-signal-processing.md#quantum-signal-processingqubitization), have a gate complexity of $\mathcal{O}\left( N^2Dt + \log(1/\epsilon) \right)$ using a [block-encoding](../../quantum-algorithmic-primitives/quantum-linear-algebra/block-encodings.md#block-encodings) based on [linear combinations of unitaries (LCU)](../../quantum-algorithmic-primitives/quantum-linear-algebra/manipulating-block-encodings.md#linear-combinations).


Spin Hamiltonians with power-law interactions were studied in [@tran2019LocalitySimPowerLaw; @childs2021TheoryTrotter], that is, where the interaction strength between spins $i$ and $j$ depends inversely on a power of the distance between the spins, denoted by $\nrm{i-j}_2$. For a $D$-dimensional lattice with $2$-local interactions with interaction strengths scaling as $1/\nrm{i-j}_2^\alpha$, $(2k)$th-order Trotter gives a scaling of (as above, suppressing the $5^{2k}$ constant factor present in $2k$th-order Trotter) [@childs2021TheoryTrotter] $$\begin{equation} \widetilde{\mathcal{O}}\left( \begin{array}{rcl} N^{3-\frac{\alpha}{D}(1+1/2k)+1/k} t^{1+1/2k}\epsilon^{-1/2k} & & \text{for } 0 \leq \alpha < D, \\
N^{2+1/2k} t^{1+1/2k}\epsilon^{-1/2k} & & \alpha \geq D\end{array} \right). \end{equation}$$ Focusing on the $D=1$ case, if one were to directly apply [quantum signal processing](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-signal-processing.md#quantum-signal-processingqubitization) based on a block-encoding via the LCU approach, the scaling would be $$\begin{equation} \widetilde{\mathcal{O}}\left( N^2 t + \log(1/\epsilon) \right) \end{equation}$$


These asymptotic complexities are complemented by the constant factor analyses discussed in the following section.


For estimating expectation values of observables to precision $\epsilon$, one can either consider directly sampling and then re-preparing the state of interest (scaling as $\mathcal{O}\left( 1/\epsilon^2 \right)$), or coherent approaches based on [amplitude estimation](../../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/amplitude-estimation.md#amplitude-estimation) scaling as $\mathcal{O}\left( 1/\epsilon \right)$, but requiring a longer coherent circuit depth. Measurements of simple observables, such as the magnetization, can be obtained through the computational basis measurements on single qubits. For more complicated observables, one can consider the approaches in [@rall2020EstimatingPhysicalQuantities; @huggins2022ExpectationValue; @apeldoorn2022TomographyStatePreparationUnitaries], discussed in more detail in the section on [quantum chemistry](../../areas-of-application/quantum-chemistry/electronic-structure-problem.md#electronic-structure-problem).


## Existing error corrected resource estimates

A number of [fault-tolerant resource estimates](../../fault-tolerant-quantum-computation/logical-gates-with-the-surface-code.md#logical-gates-with-the-surface-code) for simulating the dynamics of spin systems, or for finding their ground states via [quantum phase estimation](../../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation) have been reported in the literature. In such calculations it is necessary to optimize the constant factor contributions from implementing the algorithmic primitives used. A detailed comparative study on simulating the dynamics of a 1D nearest-neighbor Heisenberg model was reported in [@childs2018towardsFirstQSimSpeedup], comparing the logical qubit and $T$ gate counts of [product formulae](../../quantum-algorithmic-primitives/hamiltonian-simulation/product-formulae.md#product-formulae), [Taylor series](../../quantum-algorithmic-primitives/hamiltonian-simulation/taylor-and-dyson-series-linear-combination-of-unitaries.md#taylor-and-dyson-series-linear-combination-of-unitaries), and [quantum signal processing](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-signal-processing.md#quantum-signal-processingqubitization). The two most efficient approaches are shown in the first two rows of Table [1](#Tab:ResourceEst_spin_model){reference-type="ref" reference="Tab:ResourceEst_spin_model"}.





<figure markdown> <span id="Tab:ResourceEst_spin_model"></span>

|                                   **Problem**                                   |     **Method**      | **# Spins** | **# $T$ gates**  | **Logical qubits** |                                                       **Parameters**                                                        |
| :-----------------------------------------------------------------------------: | :-----------------: | :---------: | :--------------: | :----------------: | :-------------------------------------------------------------------------------------------------------------------------: |
|                               1D Heisenberg dyn.                                |         QSP         |    $50$     | $2.4\times 10^9$ |        $67$        | $\begin{gathered}B_j \in [-1,1], J^x=J^y=J^z=1,\\t=N, \epsilon=10^{-3}\end{gathered}$  [@childs2018towardsFirstQSimSpeedup] |
|                               1D Heisenberg dyn.                                | Trotter (6th order) |    $50$     | $1.8\times 10^8$ |        $50$        | $\begin{gathered}B_j \in [-1,1], J^x=J^y=J^z=1,\\t=N, \epsilon=10^{-3}\end{gathered}$ [@childs2018towardsFirstQSimSpeedup]  |
|                               2D NN TFIM[^1] dyn.                               | Trotter (4th order) |    $100$    | $1.7\times 10^5$ |       $100$        |                        $t=10/J, B=J, \epsilon=10^{-2}$ [@flannigan2022; @Beverland2022Requirements]                         |
|                              2D $1/r^2$ TFIM dyn.                               | Trotter (4th order) |    $100$    | $1.5\times 10^7$ |       $100$        |                                      $t=10/J, B=J, \epsilon=10^{-2}$ [@flannigan2022]                                       |
| 2D Heisenberg ground state with nearest- and next-nearest-neighbor interactions |    Qubitized QPE    |    $100$    |      $10^8$      |        N.C.[^2]        |                 $\epsilon=10^{-2}, J_1=1, J_2=0.5, B_j=0$         [@yoshioka2022CondensedMatterSimulation]                  |


<figcaption markdown>Table 1: Fault-tolerant resource estimates for quantum phase estimation (QPE) and dynamics simulation (dyn.) applied to different spin models. The presented gate counts are for a single run of the circuit. The results presented in rows 1 and 2 can be compared to each other, and both target an error of $\epsilon=10^{-3}$ in the operator norm distance between the ideal and implemented time evolution unitary. While [@childs2018towardsFirstQSimSpeedup] presents both analytic and empirical Trotter error bounds, the gate count presented in the table is that resulting from the empirical bound, though we remark that more recent analytic bounds are close to matching the empirical bounds [@childs2021TheoryTrotter]. The results presented in rows 3 and 4 can be compared to each other, and determine the number of Trotter steps used empirically by targeting an error of $\epsilon=10^{-2}$ in a particular spatially averaged local observable, and then extrapolating this behavior to larger system sizes. </figcaption> </figure>





On a [fault-tolerant quantum computer](../../fault-tolerant-quantum-computation/logical-gates-with-the-surface-code.md#logical-gates-with-the-surface-code) arbitrary angle rotation gates must be synthesized using a larger number of $T$ and Clifford gates [@kitaev1997quantumComputationsAlgosQEC]. The number of $T$ gates to synthesize a group of parallel rotation gates can be reduced if they share the same angle [@gidney2018_halving_addition; @CampbellHubbard22]. This technique can be exploited in fault-tolerant compilations of algorithms simulating physical spin systems, which often exhibit features such as translational invariance.


In addition to the entries given in Table [1](#Tab:ResourceEst_spin_model){reference-type="ref" reference="Tab:ResourceEst_spin_model"}, fault-tolerant approaches to simulating NMR [@obrien2021NMRsim] and muon spectroscopy [@mcardle2021Muons] experiments, which are effectively spin model simulations, have been considered.


## Caveats

The decision forms of the ground state problem for 2-local classical and quantum spin models are NP–complete [@barahona1982; @Lucas2014IsingFormulationNP] and QMA–complete [@kempe2006complexity], respectively. As such, we do not expect quantum algorithms to provide efficient solutions to these problems in the general case. Nevertheless, given the success of classical heuristics for these problems, one may hope to observe a similar benefit from quantum heuristic algorithms, such as Monte Carlo–style [Gibbs sampling algorithms](../../quantum-algorithmic-primitives/gibbs-sampling.md#gibbs-sampling).


In contrast, simulating the dynamics of spin models is a BQP-complete problem [@lloyd1996UnivQSim], and is likely one of the most simple beyond-classical calculations that could be performed on a future fault-tolerant quantum computer. While such a computation would be of great scientific interest, providing new insights in quantum information and many-body physics, it is currently unclear whether dynamics simulations of large systems will have a direct impact on industrially relevant applications.


## Comparable classical complexity and challenging instance sizes

Exact classical simulations of quantum spin models are exponentially costly in system size. Exact simulations that consider a time evolution long enough for information to propagate across the system (as per the Lieb–Robinson bound) are thus limited to around 50 spins using the largest classical supercomputers [@haner2017petabyte45qubit; @childs2018towardsFirstQSimSpeedup].


Approximate classical algorithms for studying quantum spin systems include tensor network approaches and quantum Monte Carlo methods. These methods provide empirically accurate results for computing the ground states of physically motivated spin systems, in particular those with local interactions, in low dimensions. For example, the ground states of local, gapped 1D Hamiltonians have area law entanglement, and so can be efficiently represented by matrix product states. Similar statements can be made in 2D, using e.g. projected entangled pair states (PEPS).


In contrast, these methods are less accurate when performing simulations of quantum spin dynamics [@schuch2008entropyScaling; @schollwock2011dMRG]. In these systems the entanglement entropy grows linearly with time [@calabrese2005entanglementEntropy1D], resulting in a cost that grows exponentially with time for tensor network approaches targeting fixed accuracy. For example, it was claimed in [@flannigan2022] that simulations of the dynamics of the 2D TFIM for $N=100$ spins would be far beyond the current capabilities of tensor network methods [@flannigan2022].


Many physical systems are subject to strong interactions with their environment which limits their coherence times. In these cases, the behavior of the system can often be reproduced by simulating a smaller number of spins (e.g. $\leq 30$) and accounting for the interactions with the environment through physically motivated heuristics [@wilkinson2020MuonFluorine]. Such simulations (accessible via open source software libraries) are used to analyze NMR [@hogben2011NMRSpinach] and muon spectroscopy experiments [@bonfa2021MuonSim].


## Speedup

The speedup for computing the ground states of quantum spin Hamiltonians over classical approximate methods (such as tensor networks or quantum Monte Carlo) is currently an open research question. A large speedup appears to require the availability of good initial states for quantum algorithms, without also being able to efficiently solve the problem classically [@lee2022isThereEvidenceChemistry].


The simulation of quantum spin dynamics appears to be exponentially costly using all known classical methods. As such, quantum algorithms for [Hamiltonian simulation](../../quantum-algorithmic-primitives/hamiltonian-simulation/introduction.md#hamiltonian-simulation) would provide an exponential speedup for this task. This would likely provide insights in quantum information and many–body physics. As an example, such systems could study the competition and interplay between thermalization and many–body localization in quantum systems.


## NISQ implementations


Quantum spin models are commonly used as benchmark systems for NISQ algorithms—e.g. finding ground states [@kandala2017VQE], simulating dynamics [@rosenberg2023dynamics], or probing thermalization [@mi2023SpinChainDissipation].


The Hamiltonians of spin models are also naturally realized in a wide range of physical systems, including trapped ions or neutral atoms [@bloch2012qSim; @georgescu2014qSim]. For example, recent experiments in neutral atom systems have studied the dynamics of $\mathcal{O}\left( 200 \right)$ spins, which went beyond the capabilities of classical simulation via matrix product state approaches [@ebadi2021phasesMatter; @scholl2021aFM]. Analog simulators are already an important tool providing new scientific insights, and they set a high bar for the future performance of fault-tolerant approaches to simulating spin systems.


## Outlook

Simulating the behavior of spin systems is arguably one of the most natural tasks for quantum computers, and is exponentially costly using all known classical methods. Such simulations can provide important insights into questions in quantum information and many-body physics, as well as acting as models for more complex systems in condensed matter physics and chemistry.


Fault-tolerant resource estimates for quantum algorithms simulating spin systems are among the lowest known for beyond-classical tasks. Nevertheless, analog quantum simulators are already able to natively simulate the dynamics of hundreds of spins. In order to surpass these capabilities, digital approaches may need to consider more complex observables, or target accuracies not available with error correction.


In addition, for many systems of scientific interest in related fields, such as chemistry or condensed matter physics, decoherence–inducing interactions with the environment often limit the required simulation sizes. Identifying applications requiring accurate simulation of the dynamics of large spin models would increase the impact and applicability of quantum algorithms in this area. 



[^1]: 2D nearest-neighbor transverse field Ising model.


[^2]: Not computed, scales as $\mathcal{O}\left( N+ \log(N) + \log(N/\epsilon) \right)$.

