# Quantum signal processing / quantum singular value transformation

## Rough overview (in words)

[Quantum signal processing (QSP)](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-signal-processing.md#quantum-signal-processing) and [quantum singular value transformation](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-singular-value-transformation.md#quantum-singular-value-transformation) (QSVT) are techniques for applying polynomial transformations to [block-encoded](../../quantum-algorithmic-primitives/quantum-linear-algebra/block-encodings.md#block-encodings) operators. These techniques can be used to implement Hamiltonian simulation, given a block-encoding of the Hamiltonian. Both approaches have optimal scaling with $t$ and $\epsilon$ for time-independent Hamiltonians.


QSP was initially developed for the $d$-sparse access model [@low2016HamSimQSignProc]. Through the introduction of [block-encodings](../../quantum-algorithmic-primitives/quantum-linear-algebra/block-encodings.md#block-encodings) and [qubitization](../../quantum-algorithmic-primitives/quantum-linear-algebra/qubitization.md#qubitization), it was made applicable in a standard form to Hamiltonians in a Pauli access model, $d$-sparse access model, or given as density matrices (where we are given access to a unitary that prepares a purification of the density matrix) [@low2016HamSimQubitization]. QSVT was later developed as a more general and direct route to the results of QSP [@gilyen2018QSingValTransfArXiv].


Hamiltonian simulation via QSP / QSVT is less well suited to time-dependent Hamiltonians, as the need to Trotterize the time-dependent evolution breaks the optimal dependence on the parameters.


## Rough overview (in math)

Access to the Hamiltonian $H$ is provided by an $(\alpha, m, 0)$-[block-encoding](../../quantum-algorithmic-primitives/quantum-linear-algebra/block-encodings.md#block-encodings) $U_H$ (the case of approximate block-encodings can be treated using [@gilyen2018QSingValTransfArXiv Lemma 22]) such that $$\begin{equation} \left(\bra{0}^{\otimes m} \otimes I \right) U_H \left(\ket{0}^{\otimes m} \otimes I \right) = H/\alpha \end{equation}$$ The Hamiltonian has a spectral decomposition of $\sum_\lambda \lambda \ket{\lambda} \bra{\lambda}$. We seek to use $U_H$ to implement an operator $U(t)$ approximating $$\begin{equation} \nrm{ U(t) - \sum_\lambda e^{i \lambda t} \ket{\lambda} \bra{\lambda}} \leq \epsilon. \end{equation}$$


[Qubitization](../../quantum-algorithmic-primitives/quantum-linear-algebra/qubitization.md#qubitization) converts $U_H$ into a more structured unitary $W$ (which is also a block-encoding of the Hamiltonian). The eigenvalues of $W$ are $e^{\pm i \arccos(\lambda / \alpha)}$, directly related to those of $H$. [QSP](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-signal-processing.md#quantum-signal-processing) then enables polynomial transformations to be applied to these eigenvalues, which defines the application of the polynomial to $W$. This concept can be generalized via [QSVT](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-singular-value-transformation.md#quantum-singular-value-transformation), which effectively unifies the qubitization and QSP step.


In both cases, our goal is to implement a block-encoding of $U(t) \approx \sum_\lambda e^{i \lambda t} \ket{\lambda} \bra{\lambda}$, which defines Hamiltonian simulation. In QSVT we separately implement polynomials approximating $\cos(\lambda t)$ and $i\sin(\lambda t)$, combine them using a [linear combination of block-encodings](../../quantum-algorithmic-primitives/quantum-linear-algebra/manipulating-block-encodings.md#manipulating-block-encodings), and boost the success probability using 3-step [oblivious amplitude amplification](../../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/introduction.md#amplitude-amplification-and-estimation). Further details can be found in [@gilyen2018QSingValTransfArXiv; @martyn2021GrandUnificationQAlgs]. Meanwhile, quantum signal processing implements $\exp( i t H)$ directly but requires an additional ancilla qubit and controlled access to a Hermitian block-encoding $U'_H$, which, when implemented via Eq. $\eqref{eq:genQubitiz}$, uses both controlled $U_H$ and $U_H^\dagger$ resulting in a factor of $\sim 4$ overhead [@low2016HamSimQubitization]. Altogether these considerations suggest that the QSVT-based approach might have a slightly better complexity, particularly when controlled $U_H$ is significantly more costly to implement than $U_H$. If $U_H$ is already Hermitian then quantum signal processing can have a lower complexity.


## Dominant resource cost (gates/qubits)

Using either QSP or QSVT, block-encoding a degree-$k$ polynomial $f(H)$ is performed using $\mathcal{O}\left( k \right)$ calls to the block-encoding $U_H$ [@low2016HamSimQubitization; @gilyen2018QSingValTransfArXiv]. Hence, the degree of the polynomial approximating the $e^{iHt}$ determines the complexity of Hamiltonian simulation using these techniques. As noted in [@gilyen2018QSingValTransfArXiv Corollary 60], we can rigorously bound the resources for Hamiltonian simulation via QSVT for all values of $t$ as using $$\begin{equation} \mathcal{O}\left( \alpha t + \frac{\log(1/\epsilon)}{\log(e+ \log(1/\epsilon)/\alpha t)} \right) \end{equation}$$ calls to the $(\alpha, m, 0)$-block-encoding $U_H$. This query complexity is optimal [@berry2005EffQAlgSimmSparseHam; @gilyen2018QSingValTransfArXiv], although the block-encoding can hide additional complexities, in practice. In some cases, the dependence on norm parameters can be improved by exploiting details of the simulated system, see [@low2017HamSimUnifAmp; @low2018HamSimNearlyOptSpecNorm].


For a Pauli access model the block-encoding is implemented using the [linear combination of unitaries primitives](../../quantum-algorithmic-primitives/quantum-linear-algebra/manipulating-block-encodings.md#linear-combinations) PREPARE and SELECT. For a Hamiltonian with $L$ terms $\alpha = \nrm{H}_1$, $m=\mathcal{O}\left( \log(L) \right)$, and two additional qubits are required for QSVT. The overall gate complexity depends on the exact implementation of PREPARE and SELECT, which can often be tailored to the Hamiltonian of interest. In the worst case, PREPARE uses $\Theta(L)$ gates, and SELECT uses $\Theta(nL)$ gates (although these can be significantly improved by exploiting structure in the Hamiltonian, see, e.g., [@babbush2018EncodingElectronicSpectraLinearT; @Wan2021exponentiallyfaster]). This yields an overall worst case gate complexity of $$\begin{equation} \mathcal{O}\left( nL \left( \nrm{H}_1 t + \frac{\log(1/\epsilon)}{\log(e+ \log(1/\epsilon)/\nrm{H}_1 t)} \right) \right). \end{equation}$$


For a $d$-sparse access model, $\alpha= d\nrm{H}_{\max}$ where $\nrm{H}_{\mathrm{max}} = \mathrm{max}_{i,j} \lvert \bra{i}H\ket{j} \rvert$, $m=\mathcal{O}\left( \log(d) \right)$, and two additional qubits are required for QSVT. The overall gate complexity depends on the cost of sparse access to elements of $H$. Assuming a constant gate complexity circuit for sparse access, the overall gate complexity is $$\begin{equation} \mathcal{O}\left( d\nrm{H}_{\max} t + \frac{\log(1/\epsilon)}{\log(e+ \log(1/\epsilon)/d\nrm{H}_{\max} t)} \right). \end{equation}$$


The density matrix access model seeks to perform time evolution under $e^{i\rho t}$, given access to either multiple copies of $\rho$ or a unitary $U_\rho$ that prepares a purification of $\rho$. Given $U_\rho$, we can prepare a block-encoding of $\rho$ [@low2016HamSimQubitization] (see section on [block-encodings](../../quantum-algorithmic-primitives/quantum-linear-algebra/block-encodings.md#block-encodings) for details) with $\alpha=1$. If the gate complexity of $U_\rho$ is $C(U_\rho)$ then the overall gate complexity is $$\begin{equation} \mathcal{O}\left( C(U_\rho) \left(t + \frac{\log(1/\epsilon)}{\log(e+ \log(1/\epsilon)/ t)} \right) \right). \end{equation}$$


## Caveats

The method was found to perform competitively with [Trotterization](../../quantum-algorithmic-primitives/hamiltonian-simulation/product-formulae.md#product-formulae) (and better than [Taylor series](../../quantum-algorithmic-primitives/hamiltonian-simulation/taylor-and-dyson-series-linear-combination-of-unitaries.md#taylor-and-dyson-series-linear-combination-of-unitaries)) in concrete resource estimates for simulating [spin chain Hamiltonians](../../areas-of-application/condensed-matter-physics/spin-models.md#spin-models) [@childs2018towardsFirstQSimSpeedup]. While that work had difficulty calculating the QSP phase factors, this issue has since been addressed with the development of classical algorithms for finding the phase factors [@gilyen2018QSingValTransf; @haah2018ProdDecPerFuncQSignPRoc; @dong2020efficientPhaseFindingInQSP; @chao2020FindingAngleSequences]. Nevertheless, this contributes a classical preprocessing cost to the algorithm.


It is currently unclear how to perform optimal time-dependent Hamiltonian simulation with these methods, without resorting to Trotterization. Some initial investigations have shown promising results using clock Hamiltonian constructions [@watkins2022TimeDependentClockSimulation] or for time-periodic Hamiltonians [@Mizuta2023TimePeriodicSimulation; @mizuta2023MultitimePeriodicSimulation].


## Example use cases

- Physical systems simulation: [quantum chemistry](../../areas-of-application/quantum-chemistry/introduction.md#quantum-chemistry), [condensed matter systems](../../areas-of-application/condensed-matter-physics/introduction.md#condensed-matter-physics) (see [@childs2018towardsFirstQSimSpeedup]), [quantum field theories](../../areas-of-application/nuclear-and-particle-physics/quantum-field-theories.md#quantum-field-theories), [differential equations in plasma physics](../../areas-of-application/solving-differential-equations.md#solving-differential-equations) (see [@novikau2022PlasmaSimulation]).
- Algorithms: [quantum phase estimation](../../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation), [quantum linear system solvers](../../quantum-algorithmic-primitives/quantum-linear-system-solvers.md#quantum-linear-system-solvers), [Gibbs state preparation](../../quantum-algorithmic-primitives/gibbs-sampling.md#gibbs-sampling).


## Further reading

- Pedagogical overviews [@martyn2021GrandUnificationQAlgs; @lin2022LectureNotes].
- Comparison of several Hamiltonian simulation algorithms [@childs2018towardsFirstQSimSpeedup]. 





