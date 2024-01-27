# Taylor and Dyson series (linear combination of unitaries)

## Rough overview (in words)

Taylor and Dyson series approaches for Hamiltonian simulation expand the time evolution operator as a Taylor series (time independent) [@berry2014HamSimTaylor] or Dyson series (time dependent) [@kieferova2019DysonSeriesSimulation; @berry2019TimeDependentHamSimL1] and use the [ linear combination of unitaries](../../quantum-algorithmic-primitives/quantum-linear-algebra/manipulating-block-encodings.md#linear-combinations) (LCU) primitive to apply the terms in the expansion, followed by (robust, oblivious) [amplitude amplification](../../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/introduction.md#amplitude-amplification-and-estimation) to boost the success probability close to unity. These methods are close to being asymptotically optimal, achieving linear scaling in time and logarithmic dependence on the error. However, they use a large number of ancilla qubits, compared to other Hamiltonian simulation algorithms.


## Rough overview (in math)

We focus on the time-independent case and follow the presentation in [@berry2014HamSimTaylor]. Given a Hamiltonian $H$, desired evolution time $t$, and error $\epsilon$, return a circuit $U(t)$ made of elementary gates such that $$\begin{align} \nrm{ U(t) - \mathrm{e}^{\mathrm{i} H t} } \le \epsilon. \end{align}$$ In the above, we use the operator norm (the maximal singular value) to quantify the worst-case error in the simulation.


The total evolution time $t$ is divided into $r$ segments. In each segment we evolve under an approximation of $e^{iHt/r}$. The Hamiltonian is decomposed into a linear combination of unitary operations $H = \sum_{l=1}^L \alpha_l H_l$, where we choose $\alpha_l$ real and positive by shifting phases into $H_l$, and $\nrm{H_l}=1$. This decomposition appears naturally when the Hamiltonian is given as a linear combination of Pauli products. We approximate $e^{iHt/r}$ using a Taylor expansion truncated to degree $K$ $$\begin{align} e^{iHt/r} \approx U(t/r) & := \sum_{k=0}^K \frac{1}{k!} (iHt/r)^k \\ \nonumber & =\sum_{k=0}^K \sum_{l_1, ... l_k=1}^L \frac{(it/r)^k}{k!} \alpha_{l_1} ... \alpha_{l_k} H_{l_1} ... H_{l_k}. \end{align}$$ Each segment $U(t/r)$ is implemented using [robust oblivious amplitude amplification](../../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/introduction.md#amplitude-amplification-and-estimation). Amplitude amplification is necessary because truncating the Taylor series at degree $K$ makes $U(t/r)$ non-unitary. However, textbook amplitude amplification necessitates reflecting around the initial state, (as well as the "good" state), which would be problematic since Hamiltonian simulation requires synthesizing a unitary that works simultaneously for all input states. This can be circumvented using oblivious amplitude amplification: we are given a unitary $V$ such that for any state $\ket{\psi}$, we have $V \ket{\bar{0}_m} \ket{\psi} = a \ket{\bar{0}_m} U \ket{\psi} + b \ket{(\bar{0}_m \psi)^\perp}$, for a unitary operator $U$, and the goal is to amplify the state $\ket{\bar{0}_m} U \ket{\psi}$ to be obtained with probability 1 (we can recognize $V$ as an $(a, m, 0)$ [unitary block-encoding](../../quantum-algorithmic-primitives/quantum-linear-algebra/block-encodings.md#block-encodings) of $U$). A further problem is that the above operator $U(t/r)$ is non-unitary, and so deviates from the formulation of oblivious amplitude amplification [@berry2013ExpPrecHamSimSTOC]. The proven "robustness" property of oblivious amplitude amplification [@berry2014HamSimTaylor] ensures that the error induced by treating $U(t/r)$ as a probabilistically implemented unitary does not accumulate.


The value of $K$ controls the error in the simulation and can be chosen as $$\begin{equation} K=\mathcal{O}\left( \frac{\log(\nrm{H}_1 t /\epsilon)}{ \log\log(\nrm{H}_1 t / \epsilon )} \right)\,, \end{equation}$$ where we define $\nrm{H}_1: = \sum_{l=1}^L \alpha_l$. The total time evolution is divided into $r = \nrm{H}_1 t / \ln(2)$ segments, each of duration $\ln(2) / \nrm{H}_1$. This ensures that a single application of robust oblivious amplitude amplification boosts the success probability of the segment to unity.


Within each segment we apply $U(t/r)$ using the [LCU primitive](../../quantum-algorithmic-primitives/quantum-linear-algebra/manipulating-block-encodings.md#linear-combinations). This technique can be applied to Hamiltonians given in both the Pauli and $d$-sparse access models. For the Pauli access model, the Hamiltonian is already in the form of a linear combination of unitary operators. For the $d$-sparse case, we can use graph coloring algorithms [@berry2005EffQAlgSimmSparseHam; @childs2010StarHamiltonianSimulation] to decompose the $d$-sparse Hamiltonian into a linear combination of unitaries, where each unitary is $1$-sparse and self-inverse.


## Dominant resource cost (gates/qubits)

In addition to the $n$-qubit data register, the Taylor series approach requires a number of ancilla registers to implement the LCU technique. A register with $K$ qubits is used to control the degree of the Taylor expansion, storing the value as $\ket{k} = \ket{1^{\otimes k} 0^{\otimes (K-k) }}$. An additional $K$ registers, each containing $\lceil \log_2(L) \rceil$ qubits, are used to index the possible values of each of the possible $H_{l_k}$. Hence, the overall space complexity is $\mathcal{O}\left( n + K\log(L) \right) = \mathcal{O}\left( n + \log(\nrm{H}_1 t/\epsilon)\log(L) \right)$.


Additional ancilla qubits may be required to implement the LCU gadget (i.e. in the sparse access model) or for the reflections used in robust oblivious amplitude amplification.


As discussed above, implementing each segment requires one use of robust oblivious amplitude amplification, which makes 2 calls to the LCU circuit and 1 call to its inverse. The method incurs approximation errors from truncating the Taylor series at degree $K$ and from the use of robust oblivious amplitude amplification. The resulting error per segment is bounded by $\left(e \ln{2}/(K+1) \right)^{K+1}$.


The cost of the LCU circuit depends on the Hamiltonian access model. For the case of the Pauli access model the [LCU circuit](../../quantum-algorithmic-primitives/quantum-linear-algebra/manipulating-block-encodings.md#linear-combinations) requires two calls to a PREPARE operation that prepares the ancilla registers with the correct coefficients. This requires $\mathcal{O}\left( LK \right)$ gates. The LCU circuit also requires one call to a SELECT oracle, which can be implemented using $K$ controlled-select$(H)$ operations that act as $\ket{b}\ket{l}\ket{\psi} \rightarrow \ket{b}\ket{l} (iH_l)^b \ket{\psi}$ (where $b \in \{0,1\}$), and each act on a different one of the $K$ different $\log(L)$-qubit registers. These can each be implemented using $\mathcal{O}\left( L(n + \log(L) \right)$ elementary gates [@berry2014HamSimTaylor]. The overall gate complexity in the Pauli access model is thus $$\begin{align} \mathcal{O}\left( \frac{\nrm{H}_1 t L(n + \log(L))\log(\nrm{H}_1 t / \epsilon) }{\log\log(\nrm{H}_1 t / \epsilon)} \right) = \widetilde{\mathcal{O}}\left( \nrm{H}_1 t Ln \log\left( \frac{1}{\epsilon} \right) \right) \end{align}$$


Using the LCU approach applied to a 1-sparse decomposition of a $d$-sparse Hamiltonian, the overall complexity is [@berry2014HamSimTaylor] $$\begin{align} \mathcal{O}\left( \frac{d^2 \nrm{H}_{\mathrm{max}} t n \log^2(d^2 |H|_{\mathrm{max}} t / \epsilon) }{\log\log(d^2 \nrm{H}_{\mathrm{max}} t / \epsilon)} \right) = \widetilde{\mathcal{O}}\left( d^2 \nrm{H}_{\mathrm{max}} t n \log^2\left( \frac{1}{\epsilon} \right) \right) \end{align}$$ where $\nrm{H}_{\mathrm{max}} = \mathrm{max}_{i,j} \lvert \bra{i}H\ket{j} \rvert$.


The extension to time-dependent Hamiltonians, through the use of a Dyson series, requires an additional "clock" register to store the time value and introduces a logarithmic dependence on the time derivative of the Hamiltonian [@kieferova2019DysonSeriesSimulation; @berry2019TimeDependentHamSimL1].


## Caveats

Concrete resource estimates for physical systems of interest have observed that the Taylor series approach may require more ancilla qubits and gates than [product formulae](../../quantum-algorithmic-primitives/hamiltonian-simulation/product-formulae.md#product-formulae) or [quantum signal processing](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-signal-processing.md#quantum-signal-processingqubitization) approaches for Hamiltonian simulation [@childs2018towardsFirstQSimSpeedup]. The gate complexity of the algorithm can be reduced by exploiting anticommutativity in the Hamiltonian [@Zhao2021ExploitingAnticommutationTaylorSeries], adding a corrective operation [@novo2016improved], or pruning terms with small magnitudes from the expansion [@Meister2022tailoringterm].


## Example use cases

- Physical systems simulation: [quantum chemistry](../../areas-of-application/quantum-chemistry/introduction.md#quantum-chemistry) (see [@babbush2016ExponentiallySecondQuant; @babbush2017ExponentiallyConfigInt; @su2021FaultTolerantChemistryFirstQuantized; @low2018HamiltonianInteractionPicture]), [condensed matter systems](../../areas-of-application/condensed-matter-physics/introduction.md#condensed-matter-physics), [quantum field theories](../../areas-of-application/nuclear-and-particle-physics/quantum-field-theories.md#quantum-field-theories).
- Algorithms: [quantum phase estimation](../../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation), [quantum linear system solvers](../../quantum-algorithmic-primitives/quantum-linear-system-solvers.md#quantum-linear-system-solvers), [Gibbs state preparation](../../quantum-algorithmic-primitives/gibbs-sampling.md#gibbs-sampling), [quantum adiabatic algorithm](../../quantum-algorithmic-primitives/quantum-adiabatic-algorithm.md#quantum-adiabatic-algorithm).
- Hamiltonian simulation in the interaction picture [@low2018HamiltonianInteractionPicture].


## Further reading

- A comparison of several Hamiltonian simulation algorithms, including Taylor series [@childs2018towardsFirstQSimSpeedup].
- Video lectures on [Hamiltonian simulation with Taylor series](https://www.youtube.com/watch?v=IPl9eNro6M4). 





