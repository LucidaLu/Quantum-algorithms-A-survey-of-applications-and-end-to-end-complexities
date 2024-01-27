# qDRIFT

## Rough overview (in words)

qDRIFT (the quantum stochastic drift protocol) [@campbell2019randomCompiler] assumes a Pauli access model and approximates the Hamiltonian simulation channel (as opposed to the unitary) by randomly sampling a term from the Hamiltonian (according to the coefficient magnitudes) and then evolving under the chosen term. This process is repeated for a number of steps. Because it approximates the channel, rather than the unitary, it can be more difficult to use qDRIFT as a coherent subroutine in other algorithms (see caveats below).


The error in qDRIFT depends on the 1-norm of Hamiltonian coefficients. Its main advantage is that it does not explicitly depend on the number of terms in the Hamiltonian and has small constant overheads. This may make it well suited to systems with rapidly decaying interaction strengths, dominated by a few large terms. However, its time and error dependence is asymptotically worse than other methods. This seems to originate from its randomized nature [@chen2021conRandomProduct]. qDRIFT can also be extended to time-dependent Hamiltonian simulation, where it has the benefit of scaling as $\int_0^t \nrm{H(t')} dt'$, rather than as $t \max_{t'} \nrm{H(t')}$ common to some other Hamiltonian simulation algorithms [@berry2019TimeDependentHamSimL1]. We will restrict our discussion below to the time-independent case.


## Rough overview (in math)

Given a Hamiltonian in the Pauli decomposition $H = \sum_i h_i H_i$ (with $\nrm{H_i}=1$), qDRIFT provides a stochastic channel $\mathcal{N}$ which when applied for $N$ steps, approximates the Hamiltonian simulation channel $$\begin{equation} \nrm{\mathcal{N}^N - e^{iHt} (\cdot)e^{-iHt}}_{\diamond} \le \epsilon \end{equation}$$ to within diamond-norm error $\epsilon$.


qDRIFT proceeds by randomly sampling a term according to its importance $$\begin{align} X_k \stackrel{i.i.d.}{\sim} \quad \frac{\mathrm{sign}(h_i) H_i}{p_i} \quad \text{where} \quad p_i = \frac{|h_i|}{\nrm{H}_1} \end{align}$$ and $\nrm{H}_1: = \sum_i |h_i|$ is the sum of the strengths. Each step of qDRIFT then evolves the randomly sampled term $X_k$ for a short period of time $t/N$, where $N$ is a free parameter determining the number of qDRIFT steps, which controls the error in the simulation. This implements the following quantum channel $$\begin{align} \mathcal{N}[\rho]: = \mathbb{E}[e^{i(t/N)X_k}\rho e^{-i(t/N)X_k}]. \end{align}$$ As discussed above, this channel is repeated for $N$ steps, in order to approximate the Hamiltonian simulation channel.


## Dominant resource cost (gates/qubits)

For an $n$-qubit Hamiltonian, qDRIFT acts on $n$ register qubits, and no additional ancilla qubits are required.


In order to simulate the Hamiltonian evolution channel to within diamond-norm error $\epsilon$, we require $$\begin{align} N = \mathcal{O}\left( \frac{\nrm{H}_1^2 t^2}{\epsilon} \right) \end{align}$$ steps of qDRIFT [@campbell2019randomCompiler; @chen2021conRandomProduct]. While the diamond-norm is a different error metric to the spectral norm used in other articles in this section, both provide upper bounds on the error in an observable measured with respect to the time-evolved state [@campbell2019randomCompiler]. For unitary channels, the diamond norm is effectively equal to the spectral norm (see, e.g., discussion in [@haah2023QueryOptimalChannels], up to constant factors).


The gate complexity is the number of steps multiplied by the individual costs of the elementary evolution $e^{i(t/N)X_k}$, which scales linearly with the locality of the Pauli operator $X_k$. When using qDRIFT to time evolve a state (e.g., for the purpose of measuring an observable), it is important to average the results over a sufficient number of independently sampled qDRIFT circuits [@campbell2019randomCompiler].


## Caveats

The qDRIFT algorithm has a quadratic dependence on time and linear dependence on the error $\epsilon$, while other Hamiltonian simulation methods can achieve linear time dependence and logarithmic error dependence. A higher-order variant of qDRIFT was recently developed which improves the error dependence [@nakaji2023qswift]. It is currently unclear how to design higher-order variants of qDRIFT that improve the time dependence, which appears to result from the randomized nature of the algorithm [@chen2021conRandomProduct].


As discussed above, qDRIFT approximates the time evolution channel, rather than the unitary $e^{iHt}$. As a result, it can be difficult to incorporate as a subroutine in algorithms that seek to manipulate the unitary directly—for example, measuring $\mathrm{Tr}\left(U(t) \rho \right)$. Tasks of this form feature in some approaches for [phase estimation](../../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation) [@lin2022HeisenbergLimited], motivating alternate, qDRIFT-inspired approaches, in order to exploit qDRIFT-like benefits [@wan2021RandPhaseEst].


## Example use cases

- Physical systems simulation: [quantum chemistry](../../areas-of-application/quantum-chemistry/introduction.md#quantum-chemistry), [condensed matter systems](../../areas-of-application/condensed-matter-physics/introduction.md#condensed-matter-physics), [quantum field theories](../../areas-of-application/nuclear-and-particle-physics/quantum-field-theories.md#quantum-field-theories).
- Algorithms: [quantum phase estimation](../../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation), [quantum linear system solvers](../../quantum-algorithmic-primitives/quantum-linear-system-solvers.md#quantum-linear-system-solvers), [Gibbs state preparation](../../quantum-algorithmic-primitives/gibbs-sampling.md#gibbs-sampling), [quantum adiabatic algorithm](../../quantum-algorithmic-primitives/quantum-adiabatic-algorithm.md#quantum-adiabatic-algorithm).
- Hybridization with other quantum simulation methods [@Ouyang2020compilation; @Rajput2022HybridizedMF; @hagan2022CompositeSimulation].
- Using importance sampling to incorporate variable gate costs for simulating different terms $X_k$ [@kiss2022ImportanceQdrift]. 





