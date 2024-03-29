# SYK model

## Overview

The Sachdev–Ye–Kitaev (SYK) model [@sachdev1993_sy_model; @kitaev2015_syk] is a simplified model of a quantum black hole that is strongly coupled and "maximally chaotic," but still solvable. This remarkable and, to date, unique combination of properties has led to great activity surrounding SYK. It has applications in high-energy physics through its connections to black holes and quantum gravity, and it has applications in condensed matter physics as a model of quantum chaos and scrambling, which sheds light on phases of matter in strongly coupled metals [@rosenhaus2019SYK; @song2017stronglyCorrelatedMetalSYK]. While many interesting properties of the SYK model can be computed analytically in certain limits, not all properties qualify, and questions remain about the behavior of the model outside of these limits—these questions can potentially be addressed numerically by a quantum computer.


## Actual end-to-end problem(s) solved

The SYK model has many variants; a common version to consider is the four-body ($q=4$) Majorana fermion Hamiltonian with Gaussian coefficients $$\begin{align} H_{\rm SYK} = \frac{1}{4\times 4!}\sum_{i,j,k,\ell=1}^N g_{ijk\ell} \; \chi_i\chi_j \chi_k \chi_{\ell} \,, \end{align}$$ where $\chi_i$ denote Majorana fermion mode operators obeying the anticommutation relation $\chi_i\chi_j+\chi_j\chi_i = 2\delta_{ij}$, and $g_{ijk\ell}$ are coefficients drawn independently at random from a Gaussian distribution with zero mean and variance $\sigma^2 = 3!g^2/N^3$ (with $g$ the tunable coupling strength).


In the limit of a large number of local degrees of freedom $N\rightarrow \infty$ and at strong coupling $\beta g \gg 1$ (where $\beta$ is the inverse of the temperature), the SYK model is exactly solvable (to physicists' rigor) for certain properties and provides insights into quantum gravity and quantum chaos. However, questions remain about the wealth of properties out of reach by taking limits or the nonasymptotic regime of parameters. For example, it has been challenging to rigorously calculate the density of states at a certain energy or the ground state energy of the four-body SYK model at the large-$N$ limit [@cotler2017black; @babbush2019SYKmodel; @hastings2022optimizing]. These problems can potentially be probed numerically on a quantum computer.


Generally speaking, this often boils down to performing the following task on the quantum computer: given as input an instance of $H_{\rm SYK}$ (generated by choosing the couplings $g_{ijk\ell}$ at random) and an observable $O$, estimate the expectation value $\text{tr}(\rho O)$, where $\rho$ could be, for instance, (i) the ground state of $H_{\rm SYK}$, (ii) the thermal state $\rho \propto e^{-\beta H_{\rm SYK}}$, or (iii) a time-evolved state $\rho = e^{iH_{\rm SYK}t}\ket{0}\bra{0}e^{-iH_{\rm SYK}t}$ from an easy-to-prepare initial state $\ket{0}$, among other possibilities. The observable $O$ could be a local operator or even $H_{\rm SYK}$ itself. Another case is for $O$ to be composed of $t$-dependent time-evolution unitaries $e^{iH_{\rm SYK}t}$.


For example, computing the ground state energy corresponds to taking $\rho$ to be the ground state of $H_{\rm SYK}$ and $O$ to be $H_{\rm SYK}$, and computing a 4-point out-of-time-ordered correlation function corresponds to taking $\rho$ to be the thermal state at inverse temperature $\beta$ and $O$ to be $Ae^{iH_{\rm SYK}t}Be^{-iH_{\rm SYK}t}Ae^{iH_{\rm SYK}t}Be^{-iH_{\rm SYK}t}$, where $A$ and $B$ are few-body operators [@hunter-jones2018PhDThesis]. In another example, [@Brown2019QuantumGI; @nezami2023QuantumGravityInLabII] give a detailed proposal to "simulate quantum gravity in the lab" via computing expectation values of observables and states formed via simulation of the SYK model.


Depending on the ultimate end-to-end goal, one may need to repeat this calculation for many different $O$ or for many instances of $H_{\rm SYK}$, e.g., to compute an ensemble average.


## Dominant resource cost/complexity

#### Mapping the problem to qubits:


To simulate the SYK model on a quantum computer, the Majorana operators are represented by strings of Pauli operators according to the Jordan–Wigner representation (e.g., [@garcia-alvarez2017]). As a result, the Hamiltonian $H_{\rm SYK}$ on $N$ Majoranas becomes a linear combination of multi-qubit Pauli operators over $N/2$ qubits. Methods for [Hamiltonian simulation](../../quantum-algorithmic-primitives/hamiltonian-simulation/introduction.md#hamiltonian-simulation) in this Pauli access model typically have dependencies on the number of terms, $N^4$, and on the 1-norm of Pauli coefficients, denoted by $\lambda$, which for typical SYK instances is seen to be $\lambda = \mathcal{O}\left( gN^{5/2} \right)$ (see [@babbush2019SYKmodel Eq. (16)]).


#### State preparation:


To solve the problem of estimating $\text{tr}(\rho O)$, one must be able to prepare the $(N/2)$-qubit state $\rho$. In some cases, $\rho$ could simply be a product state, which is trivial to prepare. If $\rho$ is the thermal state at inverse temperature $\beta$, then algorithms for [Gibbs sampling](../../quantum-algorithmic-primitives/gibbs-sampling.md#gibbs-sampling) would be used to prepare the state. Due to the chaotic properties of SYK and the fact that the system is expected to thermalize quickly in nature, one expects that Monte Carlo–style Gibbs samplers (e.g., [@temme2011quantumMetropolis; @chen2021fastThermalization; @Shtanko2021AlgorithmsforGibbs; @Rall_thermal_22; @chen2023QThermalStatePrep]) have a favorable $\mathrm{poly}(N)$ gate complexity, but the exact performance is unknown. If $\rho$ is the ground state of $H_{\rm SYK}$, there are several methods for preparing $\rho$, including projection onto $\rho$ by measuring (and postselecting) an ansatz state $\phi$ in the energy eigenbasis using [quantum phase estimation](../../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation) (QPE), or by [adiabatic state preparation](../../quantum-algorithmic-primitives/quantum-adiabatic-algorithm.md#quantum-adiabatic-algorithm). The cost of either of these methods is dependent on details such as which ansatz state is used (in particular, its overlap with $\rho$), the adiabatic path, and the spectrum of $H_{\rm SYK}$—in both cases, in the absence of evidence to the contrary, the scaling can be exponential in $N$. In [@hastings2022optimizing], a $\mathrm{poly}(N)$-time quantum algorithm for preparing states $\rho$ achieving a constant-factor approximation to the ground state energy of $H_{\rm SYK}$ was given, which could be used as $\rho$ to probe low-energy properties of the system.


#### Time evolution:


The calculation also requires simulating time evolution by $H_{\rm SYK}$. This can be because $O$ is a time-evolved operator, because the state $\rho$ corresponds to a time-evolved state, or simply as a subroutine for QPE or Gibbs sampling, mentioned above. Reference [@garcia-alvarez2017] proposed a scheme for simulating time evolution using a first-order [product-formula](../../quantum-algorithmic-primitives/hamiltonian-simulation/product-formulae.md#product-formulae) approach to [Hamiltonian simulation](../../quantum-algorithmic-primitives/hamiltonian-simulation/introduction.md#hamiltonian-simulation). That is, it implements the unitary $e^{iH_{\rm SYK}t}$ to precision $\epsilon$, with gate complexity $\mathcal{O}(N^{10}g^2t^2/\epsilon)$. However, this steep scaling with $N$ suggests that accessing large system sizes will be difficult with this method. Reference [@babbush2019SYKmodel] later gave a method with better $N$ dependence, achieving gate complexity $\mathcal{O}(N^{7/2}gt +N^{5/2}gt\,\text{polylog}(N/\epsilon))$, leveraging [qubitization with quantum signal processing](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-signal-processing.md#quantum-signal-processingqubitization). This gate complexity grows more slowly than the number of terms in $H_{\rm SYK}$ ($\mathcal{O}\left( N^4 \right)$), a feat that is only possible because the simulation method generates the SYK coupling coefficients pseudorandomly: they perform the PREPARE step in the [linear combination of unitaries](../../quantum-algorithmic-primitives/quantum-linear-algebra/manipulating-block-encodings.md#linear-combinations) with a shallow quantum circuit composed of $\mathrm{polylog}(N)$ random two-qubit gates, producing a state for which the $N^4$ amplitudes are distributed approximately as independent Gaussians. Further reduction in the gate count would be bottlenecked by the 1-norm $\lambda$ of the coefficients of $H_{\rm SYK}$; however, recent work [@Xu2020ASM] suggests gravitational features may remain even if the Hamiltonian is substantially sparsified, which could reduce the number of terms and the value of $\lambda$.


#### Measuring observables:


Finally, given the ability to prepare a purification of $\rho$ and supposing $O$ is unitary (if it is not, it could be decomposed into a sum of unitaries and each constituent computed separately), estimating the expectation value $\text{tr}(\rho O)$ to precision $\epsilon$ can be done by [overlap estimation](../../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/amplitude-estimation.md#amplitude-estimation), costing $\mathcal{O}\left( 1/\epsilon \right)$ calls to the routine that prepares $\rho$ and to the routine that applies $O$. If the purification of $\rho$ cannot be prepared, the cost is $\mathcal{O}\left( 1/\epsilon^2 \right)$.


## Existing error corrected resource estimates


Reference [@babbush2019SYKmodel] compiled the dominant contributions in their approach to Hamiltonian simulation into Clifford + $T$ gates, and they found that at $N=100$, implementing $e^{iHt}$ requires fewer than $10^7 gt$ $T$ gates, and at $N=200$, it requires fewer than $10^8 gt$ $T$ gates. The $T$-count can be turned into an estimate of the running time and number of physical qubits, see the discussion of [fault-tolerant quantum computation](../../fault-tolerant-quantum-computation/introduction.md#fault-tolerant-quantum-computation).


## Caveats

Existing resource estimates only focus on simulating the dynamics of SYK models, but the proposed classically challenging problems involve static properties such as density of states and properties of thermal states. Probing these static properties in an end-to-end fashion would likely require preparing thermal states, ground states, or other kinds of low-energy states, in addition to being able to implement $e^{iHt}$. The cost of preparing these states is unknown and difficult to assess analytically. Another caveat is that the gate counts quoted above do not take into account the $\mathcal{O}\left( 1/\epsilon \right)$ scaling of reading out an observable to precision $\epsilon$, or any repetitions for different instances of $H_{\rm SYK}$ required for making inferences about the physics of SYK.


## Comparable classical complexity and challenging instance sizes

As mentioned above, one of the reasons that the SYK model is appealing is that many properties can be computed analytically in certain limits. Other properties that would be of interest to numerically compute on a quantum computer require poorly scaling classical methods. Exact diagonalization of systems consisting of more than roughly 50 fermions would be very challenging due to the exponential growth of the Hilbert space, which has dimension $2^{N/2}$. For example, [@cotler2017black] and [@garcia-garcia2016spectralSYK] gave a variety of numerical results based on exact diagonalization up to $N=34$ and $N=36$, respectively.


## Speedup

Hamiltonian simulation has $\mathrm{poly}(N)$ runtime, an exponential speedup over exact diagonalization, which is the go-to method for classical simulation of SYK-related problems. However, Hamiltonian simulation does not alone solve the same end-to-end problem as exact diagonalization; the persistence of the exponential speedup requires identifying specific interesting properties where the relevant initial states can also be prepared in $\mathrm{poly}(N)$ time, which is currently less clear.


## NISQ implementations

Experimental realizations of the SYK model have been proposed on several different experimental platforms [@franz2018mimicing; @rahmani2019interactingMajoranaFermions; @luo2019SYK_with_NMR]. However, even if these demonstrations can be realized, we do not expect this approach to scale in the absence of quantum error correction.


## Outlook

Simulating time evolution of the SYK model on a quantum computer has relatively mild gate cost, due to the model's straightforward mapping to a qubit Hamiltonian. At the same time, it is difficult to simulate the SYK model on a classical computer, owing to its chaotic and strongly coupled nature. However, further work is needed to understand the entire end-to-end pipeline. It has not yet been identified which properties would be most valuable to compute on a quantum computer and how costly they will be. Computing these properties will likely involve far more than a single run of time evolution on a single instance of the SYK model, so the overall cost is likely to be much larger than what initial gate counts in the literature suggest. 





