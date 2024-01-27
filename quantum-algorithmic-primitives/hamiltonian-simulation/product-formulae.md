# Product formulae

## Rough overview (in words)

Product formulae (or Trotter–Suzuki formulae/Trotterization) [@lloyd1996UnivQSim], are the most commonly used approach for Hamiltonian simulation and are applicable to Hamiltonians in the Pauli and sparse access models (see below for definitions of these models). Product formulae divide the evolution into a repeating sequence of short unitary evolutions under subterms of the Hamiltonian. These subterm evolutions have a known decomposition into elementary quantum gates. The error in product formulae depends on the commutators between different terms in the decomposition; if all of the terms in the Hamiltonian commute, product formulae are exact.


Product formula approaches have also been extended to treat time-dependent Hamiltonians [@huyghebaert1990TimeDependent; @wiebe2010TimeDepTrotter; @wecker2015StronglyCorrelated; @An2021TimeDependent; @poulin2011TimeDepTrotterRandomized]. In the following discussion, we will restrict our focus to the time-independent case, noting that the time-dependent approaches are executed in the same way, but have a slightly more complex error analysis.


## Rough overview (in math)

Given a Hamiltonian $H$, desired evolution time $t$, and error $\epsilon$, return a circuit $U(t)$ made of elementary gates such that $$\begin{align} \nrm{ U(t) - \mathrm{e}^{\mathrm{i} H t} } \le \epsilon\,, \end{align}$$ In the above, we use the operator norm $\nrm{\cdot}$ (the maximal singular value) to quantify the quality of approximation, which controls the error for arbitrary input states (in trace distance) and for observables. This worst-case metric is mathematically convenient, but, as discussed below, tighter bounds may be obtained by using error metrics more closely aligned with the specification of the problem.


A product formula generates $U(t)$ through a product of easy-to-implement evolutions under terms in the Hamiltonian. For a Hamiltonian decomposition $H = \sum_{j=1}^L H_j$ with $L$ terms, the first-order product formula with $r$ steps is $$\begin{equation} S_1(t) = \left( \prod\nolimits_{j=1}^L e^{iH_jt/r } \right)^r. \end{equation}$$ The error in the first-order product formula is upper bounded as [@childs2021TheoryTrotter] $$\begin{equation} \nrm{S_1(t) - e^{iHt} } \leq \frac{t^2}{2r} \sum_i^L \left\lVert \sum_{j>i}^L [H_i, H_j] \right\rVert \leq \frac{\nrm{H}_1^2 t^2}{2r} \end{equation}$$ where $\nrm{H}_1 := \sum_{j=1}^L \nrm{H_j}$. Higher-order formulae can be defined recursively and are referred to as $(2k)$th-order product formulae. The error in a recursively defined $(2k)$th-order product formula is bounded by [@childs2021TheoryTrotter] $$\begin{equation} \nrm{S_{2k}(t) - e^{iHt} } = \mathcal{O}\left( \frac{\nrm{H}_1^{2k+1} t^{2k+1}}{r^{2k}} \right). \end{equation}$$


Product formulae can be applied to $d$-sparse Hamiltonians (at most $d$ nonzero elements per row/column) with efficiently row-computable nonzero elements [@aharononv2007AdiabaticQStateGeneration]. Access to the nonzero elements of the Hamiltonian is provided via oracles $O_f$ and $O_H$. The oracle $O_f$ returns the column index ($j$) of the $k \in \{1,...,d\}$th nonzero element in row $i$. The oracle $O_H$ returns the value of the matrix element $H_{ij}$. $$\begin{align} O_f & : O_f \ket{k} \ket{i} \ket{0} = \ket{k} \ket{i} \ket{j} \\
O_H & : O_H \ket{i}\ket{j}\ket{0} = \ket{i}\ket{j}\ket{H_{ij}} \end{align}$$ Using graph-coloring algorithms, a $d$-sparse Hamiltonian $H$ can be efficiently decomposed into a sum of efficiently simulable Hamiltonians [@berry2005EffQAlgSimmSparseHam; @childs2010StarHamiltonianSimulation].


As a special case of the $d$-sparse access model, one can consider Hamiltonians given as a linear combination of $L$ Pauli terms $H = \sum_{j=1}^L H_j = \sum_{j=1}^L \alpha_j P_j$, as each Pauli tensor product is already a $1$-sparse matrix (so in this case, $d\leq L$). Time evolution under each Pauli term (or in some cases, groups of Pauli terms) can be simulated efficiently, thus simplifying the $d$-sparse construction by removing the need for oracles $O_f$ and $O_H$.


## Dominant resource cost (gates/qubits)

For an $n$-qubit Hamiltonian, product formulae act on $n$ qubits. In the Pauli access model, no additional ancilla qubits are required. In the sparse access model, ancilla qubits may be required to implement the oracles $O_f$ and $O_H$ and to implement time evolution under $1$-sparse Hamiltonians $H_j$.


The gate complexity is obtained by choosing the number of Trotter steps $r$ sufficiently large to obtain an error $\epsilon$ and multiplying by the complexity of implementing each step of the product formula. It is necessary to balance the improved asymptotic scaling with $t$ (approaches linear dependence) and $\epsilon$ of higher-order Trotter formulae against the exponentially growing prefactor of the higher-order formulae. In practical simulations of [chemistry](../../areas-of-application/quantum-chemistry/introduction.md#quantum-chemistry), [condensed matter systems](../../areas-of-application/condensed-matter-physics/introduction.md#condensed-matter-physics), or [quantum field theories](../../areas-of-application/nuclear-and-particle-physics/quantum-field-theories.md#quantum-field-theories), a low-order formula (2nd–6th) typically minimizes the gate count.


A recursively defined $(2k)$th-order product formula (the first-order formula is given by $k=1/2$, and is the base case) for simulating a $d$-sparse Hamiltonian for time $t$ to accuracy $\epsilon$ requires [@childs2010StarHamiltonianSimulation] $$\begin{equation} \mathcal{O}\left( 5^{2k} d^2 (d + \log^*n) \nrm{H}t \left(\frac{d \nrm{H} t}{\epsilon} \right)^{1/2k} \right) \end{equation}$$ calls to the oracles $O_f$ and $O_H$, where $\log^*$ is the iterated logarithm.[^1]


A recursively defined $(2k)$th-order product formula for simulating an $L$-term Hamiltonian in the Pauli access model for time $t$ to accuracy $\epsilon$ requires [@childs2021TheoryTrotter] $$\begin{equation} \mathcal{O}\left( 5^{2k} nLt\left(\frac{t \alpha_{\mathrm{comm},k}}{\epsilon} \right)^{1/2k} \right) \end{equation}$$ elementary single and two-qubit gates, where $\alpha_{\mathrm{comm},k} := \sum_{i_1, i_2,\ldots, i_{2k+1}} \nrm{[H_{i_{2k+1}},\ldots [H_{i_2}, H_{i_1}]]}$. The dependence on $\alpha_{\mathrm{comm},k}$ can be tightened and calculated for lower-order formulae (see [@childs2021TheoryTrotter] for full calculations). The dependence on $n$ can be reduced to $w$ for local Hamiltonians with Pauli terms that each act on at most $w$ qubits.


## Caveats

The error bounds of product formulae in the Pauli access model have been the object of significant investigation. Evaluating the tightest spectral norm bounds requires computing a large number of commutators between the terms in the Hamiltonian, which can be computationally intensive. Numerical simulations have shown that the commutator bounds can be loose by several orders of magnitude for chemical [@babbush2015ChemicalBasisTrotter; @poulin2014TrotterStepSize] or spin [@childs2018towardsFirstQSimSpeedup] systems.


The spectral norm is the worst-case metric; it is an active area of research to find error metrics better suited to the problem at hand. For example, one may consider the *average*-case error over random input states [@chen2021conTrotter; @Zhao2021HamiltonianSW] by the normalized Frobenius norm $\nrm{U(t) - \mathrm{e}^{\mathrm{i} H t}}_{F}/\sqrt{2^n}$. Recently, in [@chen2021conTrotter] it was shown that the average-case error can be much smaller than the worst-case error for systems with large connectivity. More directly, one can also compute the Trotter error associated with input states from the low-energy [@Sahinoglu2021Hamiltonian] or low-particle-number subspace [@tong2021ProvablyAccurateGaugeTheoryBosonicSystems; @su2021NearlyTightTrottInerElect].


The gate counts of product formulae approaches can also be reduced by grouping together mutually commuting terms such that they can be implemented using fewer gates than would be required to implement all the terms individually [@vandenBerg2020circuitoptimization; @Kivlichan2020ImprovedFaultTolerantSimulationCondensedMatter; @CampbellHubbard22]. One can also reduce the number of Trotter steps required by randomizing the ordering of the terms [@Childs2019RandomizedTrotter; @cho2022doublingproductformularandom; @poulin2011TimeDepTrotterRandomized] (although this must be balanced against any compilation benefits that may be obtained from a fixed ordering).


## Example use cases

- Physical systems simulation: [quantum chemistry](../../areas-of-application/quantum-chemistry/introduction.md#quantum-chemistry), [condensed matter systems](../../areas-of-application/condensed-matter-physics/introduction.md#condensed-matter-physics), [quantum field theories](../../areas-of-application/nuclear-and-particle-physics/quantum-field-theories.md#quantum-field-theories).
- Algorithms: [quantum phase estimation](../../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation), [quantum linear system solvers](../../quantum-algorithmic-primitives/quantum-linear-system-solvers.md#quantum-linear-system-solvers), [Gibbs state preparation](../../quantum-algorithmic-primitives/gibbs-sampling.md#gibbs-sampling), [quantum adiabatic algorithm](../../quantum-algorithmic-primitives/quantum-adiabatic-algorithm.md#quantum-adiabatic-algorithm).


## Further reading

- A rigorous derivation of the error in product formulae [@childs2021TheoryTrotter].
- A comparison of product formula methods with other approaches to Hamiltonian simulation for a concrete problem of interest [@childs2018towardsFirstQSimSpeedup].
- Video lectures on [Product formulae for Hamiltonians in the Pauli access model](https://youtu.be/tJUi4g_-AIk) and [Product formulae for $d$-sparse Hamiltonians](https://youtu.be/tllz6y7WUUs). 






[^1]: For practical purposes, the iterated logarithm is essentially constant, since $\log^*(n) \leq 5$ for all $n \leq 2^{65536}$.

