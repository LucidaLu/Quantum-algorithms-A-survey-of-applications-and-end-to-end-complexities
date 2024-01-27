# Amplitude amplification

## Rough overview (in words)

Given a quantum subroutine that succeeds with a probability less than 1, amplitude amplification can be used to boost the success probability to 1 by making repeated calls to the subroutine and to a unitary that determines if the subroutine has succeeded. Amplitude amplification can be viewed as a generalization of Grover's search algorithm [@grover1996QSearch] and offers a quadratic speedup compared to classical methods in many instances.


## Rough overview (in math)

We are given an initial state $\ket{\psi_0}$, a target state $\ket{\psi_g}$ that we can mark (i.e., the ability to reflect about the state), and a unitary $U$ (and its inverse $U^\dag$) such that $$\begin{equation} U\ket{\psi_0} = \ket{\psi} = a \ket{\psi_g} + b\ket{\psi_b}\label{eq:U=a+b} \end{equation}$$ where $\ket{\psi_b}$ is a state orthogonal to the target state. In other words, $|a|^2$ is the probability of success of applying $U$ and measuring $\ket{\psi_g}$. In addition, we are given the ability to implement the reflection operator around the initial state $R_{\psi_0} = I - 2\ket{\psi_0}\bra{\psi_0}$ and an operation that, when restricted to the subspace spanned by $\{ \ket{\psi_g}, \ket{\psi_b} \}$, acts as the reflection around the target state $R_{\psi_g} = I - 2\ket{\psi_g}\bra{\psi_g}$.


Then, amplitude amplification allows us to boost the success probability to 1 through repeated calls to an operator $W = - U R_{\psi_0} U^\dag R_{\psi_g}$, from the initial state $U \ket{\psi_0} = \ket{\psi}$. The standard analysis [@brassard2002AmpAndEst] proceeds by letting $a=\sin(\theta)$ and $b=\cos(\theta)$, and showing that the 2D subspace spanned by $\ket{\psi_g}, \ket{\psi_b}$ is invariant under $W$, which acts as a rotation operator such that $\ket{\psi_g}\bra{\psi_g} W^m \ket{\psi} = \sin((2m+1)\theta) \ket{\psi_g}$.


The algorithm can also be viewed through the lens of [quantum singular value transformation](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-singular-value-transformation.md#quantum-singular-value-transformation) (QSVT) whereby $U$ provides a generalized [block-encoding](../../quantum-algorithmic-primitives/quantum-linear-algebra/block-encodings.md#block-encodings) (known as a projected unitary encoding) of the amplitude $a$. We can see this from $\ket{\psi_g}\bra{\psi_g} U \ket{\psi_0}\bra{\psi_0} = a\ket{\psi_g}\bra{\psi_0}$. We choose to apply a polynomial $f(\cdot)$ satisfying the [quantum signal processing](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-signal-processing.md#quantum-signal-processing) conditions and $f(a)=1$ to the block-encoded amplitude [@gilyen2018QSingValTransfArXiv Theorem 27 & 28]. For example, the textbook version of amplitude amplification is recovered by setting the QSVT rotation angles to $\pm \frac{\pi}{2}$.[^1] This QSVT circuit applies a degree $2m+1$ Chebyshev polynomial of the first kind $T_{2m+1}$ to the amplitude $a$, such that $\ket{\psi_g}\bra{\psi_g} W^m \ket{\psi} = T_{2m+1}(a) \ket{\psi_g} = (-1)^m \sin((2m+1)\theta) \ket{\psi_g}$ for $a=\sin(\theta)$.


## Dominant resource cost (gates/qubits)

The number of calls to $W$ is $m = \frac{\pi}{4\arcsin(a)} - \frac{1}{2} = \mathcal{O}\left( 1/a \right)$ for small $a$. Each call to $W$ requires a call to each of $U, U^\dag, R_{\psi_0}, R_{\psi_g}$. Often we have $\ket{\psi_0} = \ket{\bar{0}}$, and $U$ acts on $n$ register qubits and $k$ ancilla qubits such that $U\ket{\bar{0}} = a\ket{\psi_g}_n\ket{\bar{0}}_k + b \ket{\perp}_{n,k}$, where $\ket{\perp}_{n,k}$ denotes a state orthogonal to $\ket{\bar{0}}_k$. In this case the reflection operators are simple to implement using multi-controlled Toffoli gates.


## Caveats

The textbook version of amplitude amplification assumes that the success amplitude $a$ exactly equals $\sin\left(\pi/(4m+2)\right)$ for an integer $m$. If this is not the case (e.g., when $a= 1/\sqrt{2}$), we can introduce a new qubit in $\ket{0}$ and apply an $R_y(2\phi)$ gate to reduce the success probability (now defined by measuring $\ket{\psi_g}\ket{0}$) to $a \cos(\phi) = \sin\left(\pi/(4m'+2) \right)$ for an integer $m'$.


In cases where we can only *lower bound* the success amplitude $a \ge a_0$, it is common to use fixed-point amplitude amplification [@yoder2014FixedPointSearch]. This is best understood through QSVT [@gilyen2018QSingValTransfArXiv Theorem 27], where the reflection operators are replaced by parametrized phase operators $e^{i \theta \ket{\psi_g}\bra{\psi_g}}$ and $e^{i \phi \ket{\psi_0}\bra{\psi_0}}$ (it is shown in [@lin2022LectureNotes Section 8.5] how these phase operators can be constructed using the corresponding controlled reflection operator. If only the uncontrolled reflection is available, a control can be added using e.g., [@martyn2021GrandUnificationQAlgs Fig.5]). The QSVT rotation angles are chosen to implement a polynomial that maps *all* amplitudes taking value at least $a_0$ to at least $(1-\epsilon)$. The fixed-point amplitude amplification circuit uses a QSVT circuit that makes $\mathcal{O}\left( \frac{1}{a_0} \log\left(\frac{1}{\epsilon}\right) \right)$ calls to $U, U^\dag, e^{i \theta \ket{\psi_g}\bra{\psi_g}}$ and $e^{i \phi \ket{\psi_0}\bra{\psi_0}}$.


## Example use cases

- [Combinatorial optimization](../../areas-of-application/combinatorial-optimization/introduction.md#combinatorial-optimization).
- [Convex optimization](../../areas-of-application/continuous-optimization/introduction.md#continuous-optimization) via "minimum finding" subroutine (see [@apeldoorn2017QSDPSolvers Appendix C])
- [Weakening cryptosystems](../../areas-of-application/cryptanalysis/weakening-cryptosystems.md#weakening-cryptosystems).
- [Tensor principal component analysis](../../areas-of-application/machine-learning-with-classical-data/tensor-pca.md#tensor-pca).
- [Hamiltonian simulation using linear combinations of unitaries](../../quantum-algorithmic-primitives/hamiltonian-simulation/taylor-and-dyson-series-linear-combination-of-unitaries.md#taylor-and-dyson-series-linear-combination-of-unitaries).


## Further reading

- Both amplitude amplification and Grover search can be viewed through the lens of quantum walks on suitably constructed graphs. The quantum walks also take the form of a product of two reflections and more generally can be understood as quantizing a Markov chain describing a classical random walk [@szegedy2004QMarkovChainSearch]. We refer the interested reader to [@childs2021LectureNotes; @magniez2006SearchQuantumWalk; @apers2019UnifiedFrameworkQWSearch; @gilyen2014MScThesis].
- Oblivious amplitude amplification: Amplitude amplification can be extended to the case of oblivious amplitude amplification (OAA) [@berry2013ExpPrecHamSimSTOC]. The original formulation considered a setting where one is given unitary $U$ such that for any state $\ket{\psi}$, we have $$\begin{align} U \ket{\bar{0}_m} \ket{\psi} = a \ket{\bar{0}_m} V \ket{\psi} + b \ket{\bar{0}_m^\perp \phi} \end{align}$$ for a unitary operator $V$. The goal is to amplify the probability for the state $\ket{\bar{0}_m} V \ket{\psi}$ to 1. This is achieved through $\mathcal{O}\left( 1/a \right)$ applications of an operator $W = U (I - 2\ket{\bar{0}_m}\bra{\bar{0}_m}) U^\dag (I - 2\ket{\bar{0}_m}\bra{\bar{0}_m})$ applied to $U \ket{\bar{0}_m} \ket{\psi}$. We see that $W$ does not require reflections around the initial state $\ket{\psi}$. We can recognize $U$ as an $m$-qubit [block-encoding](../../quantum-algorithmic-primitives/quantum-linear-algebra/block-encodings.md#block-encodings) of the operator $a V$, which can be transformed to a block-encoding of $V$ using [quantum singular value transformation (QSVT)](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-singular-value-transformation.md#quantum-singular-value-transformation).[^2] The OAA subroutine is used in the context of [Hamiltonian simulation via Taylor series](../../quantum-algorithmic-primitives/hamiltonian-simulation/taylor-and-dyson-series-linear-combination-of-unitaries.md#taylor-and-dyson-series-linear-combination-of-unitaries), where it would be problematic to have to reflect around the initial state during amplification.[^3] It is also used in [@cleve2016EffLindbladianSim] (applied to isometries) for simulation of open quantum systems. OAA requires the block-encoded operator being amplified to preserve state norms (i.e. it must be an isometry), as this ensures that the success probability of the operation is independent of the state to which it is applied, which in turn enables amplification without reflection around the initial state. While a block-encoding of a non-isometric operator $A$ can also be amplified using QSVT [@gilyen2018QSingValTransfArXiv Theorem 30],[@low2017HamSimUnifAmp], it is not possible to boost the success probability of applying $A$ to unity for all input states. In the worst case, the success probability can be improved from $\sigma_{\mathrm{min}}^2$ to $\sigma_{\mathrm{min}}^2/\sigma_{\mathrm{max}}^2$, where $\sigma_{\mathrm{min}}, \sigma_{\mathrm{max}} \in [0,1]$ are the smallest and largest singular values of $A$. As a result, to boost the success probability of applying $A$ to unity for a general input state, we require regular amplitude amplification, involving reflections around the initial state.
- While we are unaware of a standard reference for the "exact\" version of amplitude amplification using an additional ancilla qubit, discussed in the caveats above, it is explained more fully in these [video lectures](#https://www.youtube.com/watch?v=5s8MEZim3GA) and also in [@mcardle2022StatePreparation Appendix A]. 






[^1]: These rotation angles enable a gate compilation that removes the need for the QSVT ancilla qubit.


[^2]: We note that in this interpretation, one may be concerned that the phase information of the unitary $V$ is lost by transforming the singular values. This turns out not to be problematic, as the phase information of $V$ can be considered stored in the basis transformation matrices present in the singular value decomposition, rather than in the diagonal singular values matrix. This is taken care of automatically using QSVT. Phases are preserved when using an odd polynomial.


[^3]: More precisely, a robust version of OAA is used which is applicable to an operator that is $\epsilon$ close to being unitary [@berry2014HamSimTaylor; @berry2015HamSimNearlyOpt].

