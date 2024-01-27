# Quantum tomography

## Rough overview (in words)

In quantum tomography we are given repeated copies of an unknown quantum state (or quantum channel) and the goal is to find a full classical description of the quantum state (or quantum channel) by extracting information by means of repeated measurements. Here, we focus on quantum state tomography, with multiple independent and identical copies of an unknown quantum state $\rho$ provided—that is of fixed and known dimension—and the task is to find an estimate of the density matrix of the quantum state up to an approximation error in some distance measure (and up to some failure probability). We are then typically interested in the optimal sample complexity in terms of the number of copies $n$, the quantum state dimension $d$, the approximation error $\varepsilon$, and the overall failure probability $\delta$. Additionally, algorithmic complexity aspects of the used schemes might be of importance as well.


## Rough overview (in math)

Given (many copies of) an unknown quantum state $\rho$ of known dimension $d$, the goal is to give a description of $\tilde{\rho}$ with the statistical estimate $\|\tilde{\rho}-\rho\|\leq\varepsilon$, up to some approximation parameter $\varepsilon\geq0$ and distance measure $\|\cdot\|$. This is achieved by extracting classical information by applying measurements $\mathcal{M}^n(\cdot)$ via $\rho^{\otimes n}$. To start with, one has to distinguish tomography schemes based on different types of measurements used. This includes in particular:


1. Independent and identical (IID) measurements, where the choice of measurement $\mathcal{M}^n=\mathcal{M}^{\otimes n}$ is fixed and the same for each copy.
2. Adapative measurements, where the choice of measurement $\mathcal{M}_2$ on the second copy can depend on the outcomes of measurement $\mathcal{M}_1$ on the first copy, and so on.
3. Entangled measurements, where one measurement $\mathcal{M}_k$ with $1<k\leq n$ is performed on $k$ copies at once.


Further, if one has some information about the type of quantum state provided, then tomography schemes can become more efficient. This includes for example pure state tomography, low-rank-$k$ state tomography, matrix product state tomography, or ground/thermal state tomography of Hamiltonians (some references on tight schemes are given later on). For some schemes, one *a priori* has certain information about the state in question and under this assumption the scheme is then promised to work (e.g., low-rank tomography [@haah2017OptTomography]). Other schemes work generally, but are only *a posteriori* guaranteed to be more efficient if the unknown state happens to be approximately of the type sought after (e.g., matrix product state tomography [@cramer2010mpstomography]). Finally, for maximum likelihood estimates or Bayesian statistical estimates and alike, priors could be added as well.


Note that the best understood case of pure state tomography can also be used for general quantum states, if one has access to the relevant purification. Specifically for pure state tomography, one then also needs to specify in what form access is given to the quantum state. Possible access models include:


- Via samples of computational basis measurements $p(x) = \langle x |\rho|x \rangle$
- Via the state preparation unitary $U\ket{0^n}\bra{0^n}U^\dagger = \rho$ (with $\rho$ pure)
- Via the controlled version of aforementioned state preparation unitary $U$
- Via aforementioned state preparation unitary $U$ and its inverse $U^\dagger$.


Finally, typically studied distance functions to measure closeness of the statistical estimate to the true quantum state are the trace distance $T(\rho,\sigma)=\frac{1}{2}\mathrm{Tr}\left[\sqrt{(\rho-\sigma)^\dagger(\rho-\sigma)}\right]$, the quantum fidelity $F(\rho,\sigma)=\left(\mathrm{Tr}\left[\sqrt{\sqrt{\rho}\sigma\sqrt{\rho}}\right]\right)^2$, and for pure quantum states also the vector two-norm $\|\vec{\rho}-\vec{\sigma}\|_2=\sqrt{(\vec{\rho}-\vec{\sigma})\cdot(\vec{\rho}-\vec{\sigma})}$.


## Dominant resource cost (gates/qubits)

Besides some potential ancilla qubits (few for typical tomographic schemes), the number of qubits is fixed by the dimension of the quantum state (of course, whenever entangled measurements are used, the corresponding number of copies is needed). As such, the sample complexity is typically the relevant figure of merit. Tight query complexity characterizations, in terms of an approximation error $\varepsilon\in[0,1]$, include the following noteworthy results (expressed in the asymptotic notation $\Theta(\cdot)$ and $\widetilde{\Theta}(\cdot)$, see below for definitions):


- $\widetilde{\Theta}(d\varepsilon^{-2})$ for pure state tomography in vector two-norm with access to controlled state preparation unitary [@kerenidis2018QIntPoint; @apeldoorn2022TomographyStatePreparationUnitaries]. The achievability results are based on the subroutine of [quantum gradient estimation](../quantum-algorithmic-primitives/quantum-gradient-estimation.md#quantum-gradient-estimation) via an unbiased version of [quantum phase estimation](../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation).
- $\widetilde{\Theta}(d\varepsilon^{-1})$ for pure state tomography in vector two-norm with access to controlled state preparation unitary and its inverse [@apeldoorn2022TomographyStatePreparationUnitaries], featuring the quadratic speedup $1/\varepsilon$ reminiscent of [amplitude amplification](../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/introduction.md#amplitude-amplification-and-estimation).
- $\Theta(dk^2\varepsilon^{-2})$ for rank-$k$ state tomography in trace distance for IID measurements [@haah2017OptTomography; @chen2022statetomoincoh; @Gross2010tomography]. The achievability results are based on low rank matrix recovery techniques, where semi-definite programs have to be solved for reconstructing the quantum state from the collected measurement statistics.
- $\widetilde{\Theta}(dk\varepsilon^{-2})$ for rank-$k$ state tomography in trace distance for entanglement measurements [@odonnell2016EfficientQuantumTomography; @haah2017OptTomography; @Yuen2023improvedsample]. The achievability results are based on representation-theoretic techniques around the Schur transform.
- $\widetilde{\Theta}(dk\varepsilon^{-1})$ for rank-$k$ state tomography in trace distance given controlled unitary access to a purification and its inverse unitary [@apeldoorn2022TomographyStatePreparationUnitaries], featuring the quadratic speedup $1/\varepsilon$ reminiscent of [amplitude amplification](../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/introduction.md#amplitude-amplification-and-estimation).


Here, the notation $\Theta(\cdot)$ stands for simultaneous upper $\mathcal{O}\left( \cdot \right)$ and lower $\Omega(\cdot)$ bounds on the asymptotic complexity. The variant $\widetilde{\Theta}(\cdot)$ then denotes the same up to factors that scale polylogarithmically in the relevant parameters. The derivations of the lower bounds are often based on information-theoretic methods, exploiting the monotonicity of quantum-entropy-based measures.


For variations of the above, additional results in terms of lower and upper bounds are known. Sample complexity lower bounds are typically obtained using information-theoretic methods. For sample complexity upper bounds, it is in practice additionally important that the algorithmic complexities of the underlying schemes become efficient (in particular for entangled measurements performed on all $n$ copies at once). Relevant metrics for the algorithmic complexity include, e.g., quantum gate depth, number of measurement outcomes needed, or the efficiency of classical postprocessing. We refer to [@lowe2022lowerboundquantumtomo] for a recent discussion on these computational aspects.


## Caveats

As shown by the presented information-theoretic lower bounds, the sample complexity for general quantum state tomography grows exponentially in the number of qubits. As such, whenever quantum tomography is invoked as a subroutine in quantum algorithms, one has to carefully analyze if this step does not eliminate any claimed speedups of the quantum algorithm compared to state-of-the-art classical methods. One also has the inverse polynomial scaling in terms of the approximation parameter from the finite statistics, which is often prohibitively expensive for certain applications.


Additionally, on top of sample complexity for tomography schemes, the accompanying gate complexity should be considered as well. We refer to [@apeldoorn2022TomographyStatePreparationUnitaries] for a discussion.


An alternative is to resort to only revealing partial classical information about quantum states, which might still be informative for the (algorithmic) task at hand. One such example with favorable scaling is shadow tomography, achieving exponentially improved sample complexities in terms of certain parameters [@aaronson2018ShadowTomography; @aaronson2018onlinelearningqstate; @huang2020predicitingmanypropfewmeas]. In more detail, there exist algorithmically efficient and universal schemes that can simultaneously $\varepsilon$-approximate $M$ linear functions $\mathrm{tr}[O_i\rho]$ of an unknown quantum state $\rho$ by only using $\mathcal{O}\left( \log(M)\cdot\max_i\|O_i\|^2_{s}\varepsilon^{-2} \right)$ IID measurements. Note the scaling with $\log(M)$ instead of the standard $M$ scaling. The shadow norm term $\|O_i\|^2_{s}$ scales in general as $d$, leading to the worst case query complexity $O\left(d\log(M)\varepsilon^{-2}\right)$. However, for observables with bounded Hilbert–Schmidt norm or for local observables, the overall dimension-free query complexity $\mathcal{O}\left( \log(M)\varepsilon^{-2} \right)$ is achievable.


## Example use cases

Quantum tomographic or related data collection schemes are omnipresent in quantum algorithms. Some applications include:


- [Quantum linear system solvers](../quantum-algorithmic-primitives/quantum-linear-system-solvers.md#quantum-linear-system-solvers) that output full classical solution vector, where such solvers are, e.g., employed for [quantum interior point methods](../quantum-algorithmic-primitives/quantum-interior-point-methods.md#quantum-interior-point-methods) or for [solving differential equations](../areas-of-application/solving-differential-equations.md#solving-differential-equations)
- Classical data about quantum states for [variational quantum algorithms](../quantum-algorithmic-primitives/variational-quantum-algorithms.md#variational-quantum-algorithms)
- Characterizing the performance of physical devices
- Characterizing quantum processes.


## Further reading

- Wikipedia article on [quantum tomography](https://en.wikipedia.org/wiki/Quantum_tomography)
- Recent overview on query complexity aspects [@apeldoorn2022TomographyStatePreparationUnitaries]
- Recent overview on computational complexity aspects [@lowe2022lowerboundquantumtomo]
- Shadow tomography of quantum states [@aaronson2018ShadowTomography]
- Predicting many properties of a quantum system from very few measurements [@huang2020predicitingmanypropfewmeas], that it is a more experimentally accessible version of shadows which works for efficiently extracting certain information from (unknown) quantum states 





